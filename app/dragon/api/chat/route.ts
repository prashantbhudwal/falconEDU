import { NextRequest } from "next/server";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { ChatCompletionRequestMessage } from "openai-edge";
import { openai } from "@/app/api/lib/openAI/config";

const handleCompletion = async (completion: string, json: any) => {
  console.log(completion);
  console.log(json);
};
const base: ChatCompletionRequestMessage[] = [
  {
    role: "system",
    content: `You are a dancing cow!`,
  },
];
export async function POST(req: NextRequest) {

  const json = await req.json();
  console.log(json);
  let { messages } = json;
  messages = [...base, ...messages];
  const res = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages,
    temperature: 0.7,
    stream: true,
  });

  const stream = OpenAIStream(res, {
    async onCompletion(completion) {
      await handleCompletion(completion, json);
    },
  });

  return new StreamingTextResponse(stream);
}
