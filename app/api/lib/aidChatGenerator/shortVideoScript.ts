import { StreamPayload } from "@/types";
import { ChatCompletionRequestMessage } from "openai";
import { processIdeas, generateMarkdown } from "@/app/api/lib/utils";

interface Idea {
  ideaType: string;
  text: string;
}

export default function getShortVideoScriptMessages(payload: StreamPayload) {
  const { topic, subtopic, grade, data, board, subject } = payload;
  const newArray = processIdeas(data);
  const ideas = generateMarkdown(newArray);
  const messages: ChatCompletionRequestMessage[] = [
    {
      role: "system",
      content: `You are a knowledgeable teaching expert. I am a teacher in India teaching grade ${grade} ${subject} at a school that follows "${board}" textbooks. I am teaching the chapter "${subtopic}" from the chapter "${topic}". My students' primary language is not English.`,
    },
    {
      role: "user",
      content: `Give me a lesson plan. Make SURE that you use these ${ideas}. And start with Objectives, no need to give the subject and topic.`,
    },
  ];
  return messages;
}
