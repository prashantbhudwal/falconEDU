import { ChatCompletionRequestMessage } from "openai";
import { outlineChatArgs, lessonChatArgs } from "./types";

export function getLessonChatMessages({
  grade,
  topic,
  subtopic,
  ideas,
}: lessonChatArgs): ChatCompletionRequestMessage[] {
  return [
    {
      role: "system",
      content: `You are a knowledgeable teaching expert. I am a teacher in India teaching grade ${grade} science at a school that follows NCERT textbooks. I am teaching the chapter "${subtopic}" from the chapter "${topic}". My students' primary language is not English.`,
    },
    {
      role: "user",
      content: `Give me a lesson plan. Make SURE that you use these ${ideas}. And start with Objectives, no need to give the subject and topic.`,
    },
  ];
}

export default function getOutlineChatMessages({
  grade,
  topic,
  subtopic,
  lesson,
}: outlineChatArgs): ChatCompletionRequestMessage[] {
  return [
    {
      role: "system",
      content: `You are a teaching assistant. Give me an outline of this lesson plan in a list. Be concise.`,
    },
    {
      role: "user",
      content: `${lesson}`,
    },
  ];
}
