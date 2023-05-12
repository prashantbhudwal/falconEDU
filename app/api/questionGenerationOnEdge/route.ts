import { NextRequest } from "next/server";
import { ChatCompletionRequestMessage } from "openai";
import { streamFromOpenAI } from "../lib/openAI";
import { predictionOptions } from "../lib/openAI/options";
import { QuestionPayload } from "@/types";
import {
  getQuestionMessages,
} from "../lib/questionChatGenerator";


export const runtime = "edge";

// This is required to enable streaming
export const dynamic = "force-dynamic";

const getRequestPayload = (messages: any) => {
  const { MODEL, TEMPERATURE, MAX_TOKENS, STREAM } = predictionOptions;
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
      max_tokens: MAX_TOKENS,
      messages: messages,
      stream: STREAM,
    }),
  };
  return requestOptions;
};

export async function POST(request: NextRequest) {
  const body: QuestionPayload = await request.json();
  const { action } = body;
  let messages: ChatCompletionRequestMessage[] = [];
  switch (action) {
    case "getQuestion":
      messages = getQuestionMessages(body);
      break;
    default:
      messages = [];
  }
  const aidPayload = getRequestPayload(messages);
  const stream = await streamFromOpenAI(aidPayload);
  return new Response(stream);
}
