import { NextRequest } from "next/server";

import { ChatCompletionRequestMessage } from "openai";
import { OpenAIStream } from "./OpenAIStream";

export const config = {
  runtime: "edge",
};
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
      content: `Give me a lesson plan. Make SURE that you use these ${ideas}. And start with Objectives, no need to give the subject and topic.`,
    },
  ];

  const stream = await OpenAIStream(messages);
  return new Response(stream);
}
