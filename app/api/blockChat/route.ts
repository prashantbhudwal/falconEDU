import { NextRequest } from "next/server";
import { ideaOptions } from "../lib/openAI/options";
import {
  Configuration,
  OpenAIApi,
  ChatCompletionRequestMessage,
} from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

export const runtime = "edge";
// This is required to enable streaming
export const dynamic = "force-dynamic";

const apiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY!,
});

const openai = new OpenAIApi(apiConfig);

export async function POST(request: NextRequest) {
  const { MODEL, TEMPERATURE, MAX_TOKENS, STREAM } = ideaOptions;

  const { prompt, content } = await request.json();
console.log("prompt", prompt)
console.log("content", content)
  
  const messages: ChatCompletionRequestMessage[] = [
    {
      role: "system",
      content: `You take a '''block''' of educational content and then transform it based on '''instructions''' provided by the teacher. Reply only with the content of the new transformed block. Don't include any flags like - block or instruction. Reject any other questions that do not involve transforming one block to another. In case of rejection, first, inform about rejection -- give a reason for rejection and then, reply with original block.`,
    },
    {
      role: "user",
      content: ` 
    block: '${content}', 
     instruction: '${prompt}'
     `,
    },
  ];

  const response = await openai.createChatCompletion({
    model: MODEL,
    stream: STREAM,
    messages: messages,
    temperature: TEMPERATURE,
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}
