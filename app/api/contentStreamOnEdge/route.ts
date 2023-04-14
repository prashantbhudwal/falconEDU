import { NextRequest } from "next/server";
import { StreamPayload } from "@/types";
import { ChatCompletionRequestMessage } from "openai";
import { OpenAIStream } from "./OpenAIStream";
import getChatCompletionRequestMessages from "../lib/promptGenerator";

export const config = {
  runtime: "edge",
};
// This is required to enable streaming
export const dynamic = "force-dynamic";



export async function POST(request: NextRequest) {
  const body: StreamPayload = await request.json();
console.log("body", body);
  const messages: ChatCompletionRequestMessage[] =
    getChatCompletionRequestMessages(body);

  const stream = await OpenAIStream(messages);
  return new Response(stream);
}
