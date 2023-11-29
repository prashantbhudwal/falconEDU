import { StreamPayload } from "@/types";
import { type ChatCompletionRequestMessage } from "openai-edge";
import { processStreamText } from "@/app/api/lib/utils";

export default function getBlackboardMessages(payload: StreamPayload) {
  const { prompt } = payload;
  const data = JSON.parse(prompt);
  const lesson = processStreamText(data);

  const messages: ChatCompletionRequestMessage[] = [
    {
      role: "system",
      content: `You are a teaching assistant. Don't give any introduction to your responses like, "As a teaching assistant.." or "As a language model". Start your response with "Here are best ways to use a blackboard during this lesson."`,
    },
    {
      role: "user",
      content: `I am a teacher. I have no computer in my classroom. I use blackboard and I need your help. How do I best use the blackboard in the class during this lesson plan - ${lesson}`,
    },
  ];
  return messages;
}
