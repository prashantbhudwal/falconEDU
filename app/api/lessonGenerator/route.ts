// app/api/route.ts
import { NextRequest } from "next/server";
import {
  getLessonCompletionStream,
  handleGPT3TurboStreamData,
} from "../openAI";
import { ChatCompletionRequestMessage } from "openai";
import { getPrompt } from "@/app/utils";

export const runtime = "nodejs";
// This is required to enable streaming
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { topic, subtopic, grade, ideaArray } = body;
  // const prompt = getPrompt(promptType);

  const messages: ChatCompletionRequestMessage[] = [
    {
      role: "system",
      content: `You are a knowledgeable teaching assistant. I am a teacher in India teaching grade ${grade} science at a school that follows NCERT textbooks. I am teaching the chapter "${subtopic}" from the chapter "${topic}". My students' primary language is not English.`,
    },
    {
      role: "user",
      content: `Give me a lesson plan, that uses the following ideas that I have come up with ${ideaArray}`,
    },
  ];
  let responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  try {
    const openaiRes = await getLessonCompletionStream(messages);
    // console.log(openaiRes.headers["x-request-id"]);
    // @ts-ignore
    openaiRes.data.on("data", (data: Buffer) =>
      handleGPT3TurboStreamData(data, writer)
    );
  } catch (error) {
    console.error("An error occurred during OpenAI request", error);
    const encoder = new TextEncoder();
    writer.write(encoder.encode("An error occurred during OpenAI request"));
    writer.close();
  }
  return new Response(responseStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
