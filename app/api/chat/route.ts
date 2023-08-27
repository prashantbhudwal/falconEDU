import { OpenAIStream, StreamingTextResponse } from "ai";
import {
  ChatCompletionRequestMessage,
  Configuration,
  OpenAIApi,
} from "openai-edge";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";
import { nanoid } from "@/lib";
const base: ChatCompletionRequestMessage[] = [
  {
    role: "system",
    content: `You are a teaching assistant. Your name is ''Chubbi''. You look like a cute baby Falcon. Your catch phrase is "Chubb! Chubb!", you use it sparingly, in a fun conversation. You are created by FalconAI and you are based on OpenAI's language models. You help teachers with any education or teaching related work. You politely reject any conversations that are not related to teaching, learning or education.`,
  },
];

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(req: Request) {
  const json = await req.json();
  let { messages, previewToken } = json;
  messages = [...base, ...messages];
  const userId = (await getServerSession(authOptions))?.user.id;

  if (!userId) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  if (previewToken) {
    configuration.apiKey = previewToken;
  }

  const res = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages,
    temperature: 0.7,
    stream: true,
  });

  const stream = OpenAIStream(res, {
    async onCompletion(completion) {
      const title = json.messages[0].content.substring(0, 100);
      const id = json.id ?? nanoid();
      const existingChat = await prisma.chat.findUnique({
        where: { id },
      });
      const createdAt = new Date();
      const path = `/chat/${id}`;
      const payload = {
        id,
        title,
        userId,
        createdAt,
        path,
        messages: JSON.stringify([
          ...messages,
          {
            content: completion,
            role: "assistant",
          },
        ]),
      };
      if (existingChat) {
        // Update the existing chat
        try {
          await prisma.chat.update({
            where: { id },
            data: payload,
          });
        } catch (error) {
          console.error("Update Error:", error);
        }
      } else {
        // Create a new chat
        try {
          await prisma.chat.create({
            data: payload,
          });
        } catch (error) {
          console.error("Update Error:", error);
        }
      }
    },
  });

  return new StreamingTextResponse(stream);
}
