import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { TaskType } from "@/types";
import { Grade } from "@prisma/client";
import { getContentGenerationMessages } from "./prompts";
import { getContentModificationMessages } from "./prompts/content-modification";
import { OPENAI_MODEL } from "../config";
export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export type ContentAPIRequestBody = {
  isFirstGeneration: boolean;
  topic: string;
  subjects: string[];
  grade: Grade;
  prompt: string;
  type: TaskType;
  lastGeneratedContent: string;
};

export async function POST(req: Request) {
  const body = (await req.json()) as ContentAPIRequestBody;
  const { isFirstGeneration } = body;
  const tokenLimit = isFirstGeneration ? 1000 : 1500;
  const engineeredMessages = isFirstGeneration
    ? getContentGenerationMessages(body)
    : getContentModificationMessages(body);

  const response = await openai.chat.completions.create({
    model: OPENAI_MODEL.GPT3,
    stream: true,
    messages: engineeredMessages,
    max_tokens: tokenLimit,
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
