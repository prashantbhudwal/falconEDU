import { NextRequest } from "next/server";
import { type ChatCompletionRequestMessage } from "openai-edge";
import { streamFromOpenAI } from "../lib/openAI";
import { worksheetOptions } from "../lib/openAI/options";
import { QuestionBankPayload, QuestionPayload } from "@/types";
import { getWorksheetAnswersMessages } from "../lib/worksheetChatGenerator/worksheetAnswers";

export const runtime = "edge";

// This is required to enable streaming
export const dynamic = "force-dynamic";

const getRequestPayload = (messages: any) => {
  const { MODEL, TEMPERATURE, MAX_TOKENS, STREAM } = worksheetOptions;
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
  const body: QuestionBankPayload = await request.json();
  const { action } = body;
  let messages: ChatCompletionRequestMessage[] = [];
  switch (action) {
    case "generateAnswers":
      messages = getWorksheetAnswersMessages(body);
      break;
    default:
      messages = [];
  }
  const aidPayload = getRequestPayload(messages);
  const stream = await streamFromOpenAI(aidPayload);
  return new Response(stream);
}
