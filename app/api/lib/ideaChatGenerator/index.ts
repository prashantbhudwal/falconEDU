import { IdeaStreamPayload } from "@/types";
import { ChatCompletionRequestMessage } from "openai";

const skipIntroduction = `Do not refer to yourself in your answers. Or give any introductory text. Do not say stuff like "As an AI language model..." or "Sure, here is ..."`;

function getEngineeredMessages(
  grade: string,
  topic: string,
  subtopic: string,
  board: string,
  subject: string
): ChatCompletionRequestMessage[] {
  return [
    {
      role: "system",
      content: `You are a teaching assistant that helps me with preparing for my class by providing ideas. ${skipIntroduction}`,
    },
    {
      role: "assistant",
      content: `How can I help?`,
    },
    {
      role: "user",
      content: `I am a "Grade ${grade}", "${subject} teacher" in India. My students' primary language is not English. In this class I am teaching the topic "${subtopic}" from the chapter "${topic}". The students are prescribed, ${board} Textbook. Make sure you adhere to this information while providing ideas. Also, never give any introductory remarks or conclusions. Just provide the ideas`,
    },
    {
      role: "assistant",
      content: `I will keep that information in mind. What would you like help with?`,
    },
  ];
}

export function getChatMessages(
  payload: IdeaStreamPayload
): ChatCompletionRequestMessage[] {
  const { grade, topic, subtopic, board, promptType, subject } = payload;
  const engineeredMessages = getEngineeredMessages(
    grade,
    topic,
    subtopic,
    board,
    subject
  );

  switch (promptType) {
    case "story":
      return [
        ...engineeredMessages,
        {
          role: "user",
          content: `Tell me a story that helps students understand: ${subtopic}. The length of the story should be according to the age of the students. But it should always be under 300 words. ${skipIntroduction}`,
        },
      ];
    case "example":
      return [
        ...engineeredMessages,
        {
          role: "user",
          content: `Provide an example that clarifies the topic of ${subtopic} for students. Keep your answers concise, as short as possible. ${skipIntroduction}`,
        },
      ];
    case "analogy":
      return [
        ...engineeredMessages,
        {
          role: "user",
          content: `Present one everyday analogy that simplifies the topic of: ${subtopic}, using familiar situations to make the idea more relatable. Keep your answers concise, as short as possible. ${skipIntroduction}`,
        },
      ];
    case "history":
      return [
        ...engineeredMessages,
        {
          role: "user",
          content: `Discuss the historical context of the topic of: ${subtopic}. Keep your answers concise, as short as possible. ${skipIntroduction}`,
        },
      ];
    case "application":
      return [
        ...engineeredMessages,
        {
          role: "user",
          content: `Describe a real-world application of the topic "${subtopic}", that students can relate to. Keep your answers concise, as short as possible. ${skipIntroduction}`,
        },
      ];
    case "antiExample":
      return [
        ...engineeredMessages,
        {
          role: "user",
          content: `Explain one counterexample that helps students differentiate between correct and incorrect understanding of: ${subtopic}. Keep your answers concise, as short as possible. ${skipIntroduction}`,
        },
      ];
    case "contrast":
      return [
        ...engineeredMessages,
        {
          role: "user",
          content: `Compare and contrast this topic with other closely related topics to help students distinguish between them: ${subtopic}. Keep your answers concise, as short as possible. ${skipIntroduction}`,
        },
      ];
    case "definition":
      return [
        ...engineeredMessages,
        {
          role: "user",
          content: `Define the topic in a clear and concise manner for students: ${subtopic}. Keep your answers concise, as short as possible. ${skipIntroduction}`,
        },
      ];
    case "activity":
      return [
        ...engineeredMessages,
        {
          role: "user",
          content: `Be creative and suggest one engaging and exciting small group activity that helps students understand: ${subtopic}. The activity should always have numbered steps. Keep your answers concise, as short as possible. ${skipIntroduction}`,
        },
      ];
    case "quiz":
      return [
        ...engineeredMessages,
        {
          role: "user",
          content: `Design a 5-question MCQ quiz that targets the core ideas and principles of: ${subtopic}, ensuring students grasp the most important aspects. Keep your answers concise, as short as possible. ${skipIntroduction}`,
        },
      ];
    default:
      return [
        ...engineeredMessages,
        {
          role: "user",
          content: `Provide an example that clarifies the topic for students: ${subtopic}. Keep your answers concise, as short as possible. Keep your answers concise, as short as possible. ${skipIntroduction}`,
        },
      ];
  }
}
