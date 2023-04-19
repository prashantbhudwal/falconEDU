// app/api/route.ts
import { NextRequest } from "next/server";
import { ChatCompletionRequestMessage } from "openai";
import { IdeaStreamPayload } from "@/types";
import { getChatMessages } from "../lib/ideaChatGenerator";
import { ideaOptions } from "../lib/openAI/options";
import { streamFromOpenAI } from "../lib/openAI";

export const config = {
  runtime: "edge",
};
// This is required to enable streaming
export const dynamic = "force-dynamic";

const getIdeaRequestPayload = (messages: any) => {
  const { MODEL, TEMPERATURE, MAX_TOKENS, STREAM } = ideaOptions;
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
  const payload: IdeaStreamPayload = await request.json();
  const messages: ChatCompletionRequestMessage[] = getChatMessages(payload);

  const aidPayload = getIdeaRequestPayload(messages);
  const stream = await streamFromOpenAI(aidPayload);

  return new Response(stream);
}
