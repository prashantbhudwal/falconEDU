import { IdeaStreamPayload } from "@/types";
import { PredictionPayload } from "@/types";
import { ChatCompletionRequestMessage } from "openai";

function getSystemMessage(
  grade: string,
  topic: string,
  subtopic: string
): string {
  return `You are a teaching assistant that helps me with lesson planning by providing ideas. I am a teacher in India teaching teaching the topic "${subtopic}" from the chapter "${topic}" from the Grade ${grade}, NCERT Science Textbook. My students' primary language is not English. Make sure you adhere to the Grade ${grade}, NCERT Science Textbook.`;
}

export function getChapterMessages(
  payload: PredictionPayload
): ChatCompletionRequestMessage[] {
  const { grade, subject, board } = payload.data;
  return [
    {
      role: "system",
      content: `I want to teach "Properties of Matter" to grade 6 students in India.  Give me a list of topics to focus on, and make sure that you reply with just the "Underscore Separated Values" of the topics, each topic starts with a $$ and ends with a $$, and nothing else, no comments, no conclusions, nothing. No adding comments like, here is a list. The response should just have a list and that's it. I am putting this output directly in code, so don't mess it up. No spaces after commas.`,
    },
    {
      role: "assistant",
      content: `$$States of matter$$_$$Physical and chemical properties of matter$$_$$Density and buoyancy$$_$$Solids, liquids, gases and plasma$$_$$Changes in states of matter (melting, freezing, boiling)$$_$$Mixtures and solutions$$`,
    },
    {
      role: "user",
      content: `Okay, perfect format. Here is sample output: "$$Value$$_$$Value$$_$$Value$$" Now, I want to teach "${subject}" to grade ${grade}, ${board} students in India.  Give me a list of chapters to focus on, in the same format.`,
    },
  ];
}

export function getSubtopicMessages(
  payload: PredictionPayload
): ChatCompletionRequestMessage[] {
  const { grade, subject, board, topic } = payload.data;
  return [
    {
      role: "system",
      content: `I want to teach "Properties of Matter" to grade 6 students in India.  Give me a list of topics to focus on, and make sure that you reply with just the "Underscore Separated Values" of the topics, each topic starts with a $$ and ends with a $$, and nothing else, no comments, no conclusions, nothing. No adding comments like, here is a list. The response should just have a list and that's it. I am putting this output directly in code, so don't mess it up. No spaces after commas.`,
    },
    {
      role: "assistant",
      content: `$$States of matter$$_$$Physical and chemical properties of matter$$_$$Density and buoyancy$$_$$Solids, liquids, gases and plasma$$_$$Changes in states of matter (melting, freezing, boiling)$$_$$Mixtures and solutions$$`,
    },
    {
      role: "user",
      content: `Okay, perfect format. Here is sample output: "$$Value$$_$$Value$$_$$Value$$" Now, I want to teach "${subject}" to grade ${grade}, ${board} students in India.  I am focusing on the chapter "${topic}".Give me a list of topics to focus on from this chapter, in the same format.`,
    },
  ];
}
