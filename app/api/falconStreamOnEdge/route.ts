// app/api/route.ts
import { NextRequest } from "next/server";
import { ChatCompletionRequestMessage } from "openai";
import { IdeaStreamPayload } from "@/types";
import { getChatMessages } from "../lib/ideaChatGenerator";
import { ideaOptions } from "../lib/openAI/options";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { openai } from "../lib/openAI/config";
export const runtime = "edge";

// This is required to enable streaming
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const { MODEL, TEMPERATURE, MAX_TOKENS, STREAM } = ideaOptions;

  const payload: IdeaStreamPayload = await request.json();
  const messages: ChatCompletionRequestMessage[] = getChatMessages(payload);

  const response = await openai.createChatCompletion({
    model: MODEL,
    stream: STREAM,
    messages: messages,
    temperature: TEMPERATURE,
  });
  const stream = OpenAIStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
  // const aidPayload = getIdeaRequestPayload(messages);
  // const stream = await streamFromOpenAI(aidPayload);

  // return new Response(stream);
}


// const getIdeaRequestPayload = (messages: any) => {
//   const { MODEL, TEMPERATURE, MAX_TOKENS, STREAM } = ideaOptions;
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
//       // max_tokens: MAX_TOKENS, //TODO Change to variable
//       messages: messages,
//       stream: STREAM,
//     }),
//   };
//   return requestOptions;
// };