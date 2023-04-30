import { StreamPayload } from "@/types";
import { ChatCompletionRequestMessage } from "openai";
import { processStreamText } from "@/app/api/lib/utils";

export default function getBlackboardMessages(payload: StreamPayload) {
  const { data, grade, topic, subtopic } = payload;
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
