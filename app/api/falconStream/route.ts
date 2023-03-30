import { getPrompt } from "@/app/utils";
import { NextRequest, NextResponse } from "next/server";
import getCompletion from "@/app/api/openAI";
import { ChatCompletionRequestMessage } from "openai";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { topic, subtopic, grade, promptType } = body;

  const prompt = getPrompt(promptType);

  const messages: ChatCompletionRequestMessage[] = [
    {
      role: "system",
      content: `You are a knowledgeable teaching assistant. I am a teacher in India teaching grade ${grade} science at a school that follows NCERT textbooks. I am teaching the chapter "${subtopic}" from the chapter "${topic}". My students' primary language is not English. Help me brainstorm ideas and strategies for effectively teaching this topic in my classroom. Keep your answers concise.`,
    },
    {
      role: "user",
      content: `${prompt}: ${subtopic} from the chapter ${topic} of grade ${grade} NCERT science textbook.`,
    },
  ];
  const openAIresponse = await getCompletion(messages);
  const response = { ...openAIresponse, topic, promptType };
  return NextResponse.json({ response });
}
