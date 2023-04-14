import { StreamPayload } from "@/types";
import { ChatCompletionRequestMessage } from "openai";
import { processStreamText } from "../utils";

export default function getOutlineMessages(payload: StreamPayload) {
  const { data, grade, topic, subtopic } = payload;
  const lesson = processStreamText(data);
  console.log(lesson);

  const messages: ChatCompletionRequestMessage[] = [
    {
      role: "system",
      content: `You are a knowledgeable teaching expert. I am a teacher in India teaching grade ${grade} science at a school that follows NCERT textbooks. I am teaching the chapter "${subtopic}" from the chapter "${topic}". My students' primary language is not English.`,
    },
    {
      role: "user",
      content: `Give me an outline of this lesson plan. ${lesson}`,
    },
  ];
  return messages;
}
