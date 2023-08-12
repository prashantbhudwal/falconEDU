import { kv } from "@vercel/kv";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import prisma from "@/prisma";
import { nanoid } from "@/utils";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(req: Request) {
  const json = await req.json();
  const { messages, previewToken } = json;
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
      const createdAt = Date.now();
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
        await prisma.chat.update({
          where: { id },
          data: payload,
        });
      } else {
        // Create a new chat
        await prisma.chat.create({
          data: payload,
        });
      }
    },
  });

  return new StreamingTextResponse(stream);
}
