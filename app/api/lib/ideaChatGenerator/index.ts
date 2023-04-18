import { IdeaStreamPayload } from "@/types";
import { ChatCompletionRequestMessage } from "openai";

function getSystemMessage(
  grade: string,
  topic: string,
  subtopic: string
): string {
  return `You are a knowledgeable teaching assistant. I am a teacher in India teaching grade ${grade} science at a school that follows NCERT textbooks. I am teaching the topic "${subtopic}" from the chapter "${topic}". My students' primary language is not English. Help me brainstorm ideas and strategies for effectively teaching this topic in my classroom.`;
}

export function getChatMessages(
  payload: IdeaStreamPayload
): ChatCompletionRequestMessage[] {
  const { grade, topic, subtopic, promptType } = payload;
  switch (promptType) {
    case "story":
      return [
        {
          role: "system",
          content: getSystemMessage(grade, topic, subtopic),
        },
        {
          role: "user",
          content: `Compose a concise, engaging story that illuminates the concept of: ${subtopic} from the chapter ${topic} of grade ${grade} NCERT science textbook, using straightforward language to aid understanding.`,
        },
      ];
    case "example":
      return [
        {
          role: "system",
          content: getSystemMessage(grade, topic, subtopic),
        },
        {
          role: "user",
          content: `Provide an engaging example that explains the concept of: ${subtopic} from the chapter ${topic} of grade ${grade} NCERT science textbook, helping students to better visualize the idea. Keep your answers concise, as short as possible. Start with, "Here is an example..."`,
        },
      ];
    case "analogy":
      return [
        {
          role: "system",
          content: getSystemMessage(grade, topic, subtopic),
        },
        {
          role: "user",
          content: `Present an everyday analogy that simplifies the concept of: ${subtopic} from the chapter ${topic} of grade ${grade} NCERT science textbook, using familiar situations to make the idea more relatable.`,
        },
      ];
    case "history":
      return [
        {
          role: "system",
          content: getSystemMessage(grade, topic, subtopic),
        },
        {
          role: "user",
          content: `Summarize the historical context of: ${subtopic} from the chapter ${topic} of grade ${grade} NCERT science textbook, focusing on its impact on scientific advancements and understanding.`,
        },
      ];
    case "application":
      return [
        {
          role: "system",
          content: getSystemMessage(grade, topic, subtopic),
        },
        {
          role: "user",
          content: `Explain a real-life application of: ${subtopic} from the chapter ${topic} of grade ${grade} NCERT science textbook that students encounter in their daily lives, demonstrating the concept's practical relevance.`,
        },
      ];
    case "antiExample":
      return [
        {
          role: "system",
          content: getSystemMessage(grade, topic, subtopic),
        },
        {
          role: "user",
          content: `Explain a counterexample that helps students differentiate between correct and incorrect understanding of: ${subtopic} from the chapter ${topic} of grade ${grade} NCERT science textbook. Keep your answers concise, as short as possible.`,
        },
      ];
    case "contrast":
      return [
        {
          role: "system",
          content: getSystemMessage(grade, topic, subtopic),
        },
        {
          role: "user",
          content: `Explain the similarities and differences between the concept of: ${subtopic} and related topics from the chapter ${topic} of grade ${grade} NCERT science textbook, using clear examples to aid comprehension.`,
        },
      ];
    case "definition":
      return [
        {
          role: "system",
          content: getSystemMessage(grade, topic, subtopic),
        },
        {
          role: "user",
          content: `Define the concept in a clear and concise manner for students: ${subtopic} from the chapter ${topic} of grade ${grade} NCERT science textbook. Keep your answers concise, as short as possible.`,
        },
      ];
    case "activity":
      return [
        {
          role: "system",
          content: getSystemMessage(grade, topic, subtopic),
        },
        {
          role: "user",
          content: `Be creative and suggest a hands-on, interactive small group activity that fosters deeper comprehension of: ${subtopic} from the chapter ${topic} of grade ${grade} NCERT science textbook, encouraging experiential learning.`,
        },
      ];
    case "quiz":
      return [
        {
          role: "system",
          content: getSystemMessage(grade, topic, subtopic),
        },
        {
          role: "user",
          content: `Design a 5-question MCQ quiz that targets the core ideas and principles of: ${subtopic} from the chapter ${topic} of grade ${grade} NCERT science textbook, ensuring students grasp the most important aspects.`,
        },
      ];
    default:
      return [
        {
          role: "system",
          content: getSystemMessage(grade, topic, subtopic),
        },
        {
          role: "user",
          content: `Provide an example that clarifies the concept for students: ${subtopic} from the chapter ${topic} of grade ${grade} NCERT science textbook. Keep your answers concise, as short as possible.`,
        },
      ];
  }
}
