import { NextRequest } from "next/server";
import { ChatCompletionRequestMessage } from "openai";
import { streamFromOpenAI } from "../lib/openAI";
import { lessonOptions } from "../lib/openAI/options";
import { PredictionPayload } from "@/types";
export const config = {
  runtime: "edge",
};
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
      max_tokens: MAX_TOKENS,
      messages: messages,
      stream: STREAM,
    }),
  };
  return requestOptions;
};

export async function POST(request: NextRequest) {
  const body: PredictionPayload = await request.json();
  const { grade, topic, board } = body;
  const messages: ChatCompletionRequestMessage[] = [
    {
      role: "system",
      content: `I want to teach "Properties of Matter" to grade 6 students in India.  Give me a list of topics to focus on, and make sure that you reply with just the CSV of the topics, each topic starts and ends with a backtick, and nothing else, no comments, no conclusions, nothing. No adding comments like, here is a list. The response should just have a list and that's it. I am putting this output directly in code, so don't mess it up. No spaces after commas.`,
    },
    {
      role: "assistant",
      content: `[States of matter],[Physical and chemical properties of matter],[Density and buoyancy],[Solids, liquids, gases and plasma],[Changes in states of matter (melting, freezing, boiling)],[Mixtures and solutions]`,
    },
    {
      role: "user",
      content: `Okay, perfect format. I am a ${board} teacher teaching "${topic}" to "Grade ${grade}" students. Give me a list of topics to focus on, in the same format.`,
    },
  ];
  const aidPayload = getAidRequestPayload(messages);
  const stream = await streamFromOpenAI(aidPayload);
  return new Response(stream);
}
