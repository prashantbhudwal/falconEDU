import { StreamPayload } from "@/types";
import { ChatCompletionRequestMessage } from "openai";
import { processStreamText } from "../utils";
import { getLessonChatMessages } from "../chatMessages";

interface Idea {
  ideaType: string;
  text: string;
}
function generateMarkdown(ideas: Idea[]): string {
  const markdown = ideas.reduce((acc, idea) => {
    // Add a separator between ideas
    if (acc.length > 0) {
      acc += "\n\n";
    }
    // Add the idea type as a heading
    acc += `## ${idea.ideaType}\n\n`;
    // Add the cleaned idea text as a paragraph
    acc += `${idea.text}\n`;
    return acc;
  }, "");

  return `ideas:\n\n${markdown}`;
}

export default function getLessonPlanMessages(payload: StreamPayload) {
  const { topic, subtopic, grade, data } = payload;
  const newArray = data.map((obj: any) => ({
    ideaType: obj.type,
    text: processStreamText(obj.text),
  }));
  const ideas = generateMarkdown(newArray);
  const messages: ChatCompletionRequestMessage[] = getLessonChatMessages({
    grade,
    topic,
    subtopic,
    ideas,
  });
  return messages;
}
