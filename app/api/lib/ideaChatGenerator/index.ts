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
          content: `Provide an example that clarifies the concept for students: ${subtopic} from the chapter ${topic} of grade ${grade} NCERT science textbook. Keep your answers concise, as short as possible.`,
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
          content: `Provide an example that clarifies the concept for students: ${subtopic} from the chapter ${topic} of grade ${grade} NCERT science textbook. Keep your answers concise, as short as possible.`,
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
          content: `Share an analogy that makes the concept easier for students to grasp: ${subtopic} from the chapter ${topic} of grade ${grade} NCERT science textbook. Keep your answers concise, as short as possible.`,
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
          content: `Make a MCQ quiz of 5 questions to assess the students on the topic of: ${subtopic} from the chapter ${topic} of grade ${grade} NCERT science textbook. Keep your answers concise, as short as possible.`,
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
