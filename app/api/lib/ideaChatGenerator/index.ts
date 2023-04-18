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
          content: `Compose a concise, engaging story that illuminates the concept of: ${subtopic} from the chapter ${topic} of grade ${grade} NCERT science textbook, using straightforward language to aid understanding. Keep your answers concise, as short as possible.`,
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
          content: `Provide one engaging example that explains the concept of: ${subtopic} from the chapter ${topic} of grade ${grade} NCERT science textbook, helping students to better visualize the idea. Keep your answers concise, as short as possible. Start with, "Here is an example..."`,
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
          content: `Present one everyday analogy that simplifies the concept of: ${subtopic} from the chapter ${topic} of grade ${grade} NCERT science textbook, using familiar situations to make the idea more relatable. Keep your answers concise, as short as possible.`,
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
          content: `Discuss the historical context or background of: ${subtopic} from the chapter ${topic} of grade ${grade} NCERT science textbook. Keep your answers concise, as short as possible.`,
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
          content: `Describe a real-world application of this concept that students can relate to: ${subtopic} from the chapter ${topic} of grade ${grade} NCERT science textbook. Keep your answers concise, as short as possible.`,
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
          content: `Explain one counterexample that helps students differentiate between correct and incorrect understanding of: ${subtopic} from the chapter ${topic} of grade ${grade} NCERT science textbook. Keep your answers concise, as short as possible.`,
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
          content: `Compare and contrast this concept with other closely related topics to help students distinguish between them: ${subtopic} from the chapter ${topic} of grade ${grade} NCERT science textbook. Keep your answers concise, as short as possible.`,
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
          content: `Be creative and suggest one engaging and exciting small group activity that helps students understand: ${subtopic} from the chapter ${topic} of grade ${grade} NCERT science textbook. Keep your answers concise, as short as possible.`,
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
          content: `Design a 5-question MCQ quiz that targets the core ideas and principles of: ${subtopic} from the chapter ${topic} of grade ${grade} NCERT science textbook, ensuring students grasp the most important aspects. Keep your answers concise, as short as possible.`,
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
          content: `Provide an example that clarifies the concept for students: ${subtopic} from the chapter ${topic} of grade ${grade} NCERT science textbook. Keep your answers concise, as short as possible. Keep your answers concise, as short as possible.`,
        },
      ];
  }
}
