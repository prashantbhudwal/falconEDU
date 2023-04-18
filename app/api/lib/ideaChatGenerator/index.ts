import { IdeaStreamPayload } from "@/types";
import { ChatCompletionRequestMessage } from "openai";

function getSystemMessage(
  grade: string,
  topic: string,
  subtopic: string
): string {
  return `You are a teaching assistant. I am a teacher in India teaching teaching the topic "${subtopic}" from the chapter "${topic}" from the Grade ${grade}, NCERT Science Textbook. My students' primary language is not English. Help me brainstorm ideas and strategies for effectively teaching this topic in my classroom. Make sure you adhere to the Grade ${grade}, NCERT Science Textbook.`;
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
          content: `Tell me a story that helps students understand: ${subtopic}. Keep your answers concise, as short as possible.`,
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
          content: `Provide one engaging example that explains the concept of: ${subtopic}, helping students to better visualize the idea. Keep your answers concise, as short as possible. Start with, "Here is an example..."`,
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
          content: `Present one everyday analogy that simplifies the concept of: ${subtopic}, using familiar situations to make the idea more relatable. Keep your answers concise, as short as possible.`,
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
          content: `Discuss the historical context of the concept of: ${subtopic}. Keep your answers concise, as short as possible.`,
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
          content: `Describe a real-world application of this concept that students can relate to: ${subtopic}. Keep your answers concise, as short as possible.`,
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
          content: `Explain one counterexample that helps students differentiate between correct and incorrect understanding of: ${subtopic}. Keep your answers concise, as short as possible.`,
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
          content: `Compare and contrast this concept with other closely related topics to help students distinguish between them: ${subtopic}. Keep your answers concise, as short as possible.`,
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
          content: `Define the concept in a clear and concise manner for students: ${subtopic}. Keep your answers concise, as short as possible.`,
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
          content: `Be creative and suggest one engaging and exciting small group activity that helps students understand: ${subtopic}. Keep your answers concise, as short as possible.`,
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
          content: `Design a 5-question MCQ quiz that targets the core ideas and principles of: ${subtopic}, ensuring students grasp the most important aspects. Keep your answers concise, as short as possible.`,
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
          content: `Provide an example that clarifies the concept for students: ${subtopic}. Keep your answers concise, as short as possible. Keep your answers concise, as short as possible.`,
        },
      ];
  }
}
