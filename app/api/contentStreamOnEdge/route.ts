import { NextRequest } from "next/server";
import { StreamPayload } from "@/types";
import { type ChatCompletionRequestMessage } from "openai-edge";
import getChatCompletionRequestMessages from "../lib/aidChatGenerator";
import { lessonOptions } from "../lib/openAI/options";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { openai } from "../lib/openAI/config";

// This is required to enable streaming
export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function POST(request: NextRequest) {
  const { MODEL, TEMPERATURE, MAX_TOKENS, STREAM } = lessonOptions;
  const body: StreamPayload = await request.json();
  const messages: ChatCompletionRequestMessage[] =
    getChatCompletionRequestMessages(body);
  const response = await openai.createChatCompletion({
    model: MODEL,
    stream: STREAM,
    messages: messages,
    temperature: TEMPERATURE,
    max_tokens: MAX_TOKENS,
  });
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}

// const getAidRequestPayload = (messages: any) => {
//   const { MODEL, TEMPERATURE, MAX_TOKENS, STREAM } = lessonOptions;
//   const requestOptions = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//     },
//     responseType: "stream",
//     body: JSON.stringify({
//       model: MODEL,
//       temperature: TEMPERATURE,
//       max_tokens: MAX_TOKENS,
//       messages: messages,
//       stream: STREAM,
//     }),
//   };
//   return requestOptions;
// };
