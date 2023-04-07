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

interface Idea {
  ideaType: string;
  text: string;
}

function generateGptPrompt(ideas: Idea[]): string {
  const promptText = ideas.reduce((acc, idea) => {
    // Add a separator between ideas
    if (acc.length > 0) {
      acc += "\n\n";
    }
    // Add the idea type as a heading
    acc += `## ${idea.ideaType}\n\n`;
    // Add the idea text as a paragraph
    acc += `${idea.text}\n`;
    return acc;
  }, "");

  return `ideas:\n\n${promptText}`;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { topic, subtopic, grade, ideaArray } = body;
  const newArray = ideaArray.map((obj: any) => ({
    ideaType: obj.type,
    text: obj.text.join(" "),
  }));
  const ideas = generateGptPrompt(newArray);
  const messages: ChatCompletionRequestMessage[] = [
    {
      role: "system",
      content: `You are a knowledgeable teaching expert. I am a teacher in India teaching grade ${grade} science at a school that follows NCERT textbooks. I am teaching the chapter "${subtopic}" from the chapter "${topic}". My students' primary language is not English.`,
    },
    {
      role: "user",
      content: `Give me a step-by-step lesson plan. Make SURE that you use these ${ideas}. And start with Objectives, no need to give the subject and topic.`,
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
