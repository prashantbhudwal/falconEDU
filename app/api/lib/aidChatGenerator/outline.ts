import { StreamPayload } from "@/types";
import { type ChatCompletionRequestMessage } from "openai-edge";
import { processStreamText } from "@/app/api/lib/utils";

export default function getOutlineMessages(payload: StreamPayload) {
  const { prompt, grade, topic, subtopic } = payload;
  const data = JSON.parse(prompt);
  const lesson = processStreamText(data);

  const messages: ChatCompletionRequestMessage[] = [
    {
      role: "system",
      content: `You are a teaching assistant. Give me an outline of this lesson plan in a list. Be concise. Don't mention objectives or materials needed.`,
    },
    {
      role: "user",
      content: `${lesson}`,
    },
  ];
  return messages;
}
