import { NextRequest } from "next/server";
import { StreamPayload } from "@/types";
import { ChatCompletionRequestMessage } from "openai";
import { streamFromOpenAI } from "../lib/openAI";
import getChatCompletionRequestMessages from "../lib/aidChatGenerator/chatGenerator";
import { lessonOptions } from "../lib/openAI/options";
export const runtime = "edge";

// This is required to enable streaming
export const dynamic = "force-dynamic";

const getAidRequestPayload = (messages: any) => {
  const { MODEL, TEMPERATURE, MAX_TOKENS, STREAM } = lessonOptions;
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    responseType: "stream",
    body: JSON.stringify({
      model: MODEL,
      temperature: TEMPERATURE,
      // max_tokens: MAX_TOKENS, //TODO Change to variable
      messages: messages,
      stream: STREAM,
    }),
  };
  return requestOptions;
};

export async function POST(request: NextRequest) {
  const body: StreamPayload = await request.json();
  const messages: ChatCompletionRequestMessage[] =
    getChatCompletionRequestMessages(body);
  const aidPayload = getAidRequestPayload(messages);
  const stream = await streamFromOpenAI(aidPayload);
  return new Response(stream);
}
