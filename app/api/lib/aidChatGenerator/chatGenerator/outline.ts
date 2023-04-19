import { StreamPayload } from "@/types";
import { ChatCompletionRequestMessage } from "openai";
import { processStreamText } from "../../utils";
import getOutlineChatMessages from "../chatMessages";

export default function getOutlineMessages(payload: StreamPayload) {
  const { data, grade, topic, subtopic } = payload;
  const lesson = processStreamText(data);

  const messages: ChatCompletionRequestMessage[] = getOutlineChatMessages({
    grade,
    topic,
    subtopic,
    lesson,
  });
  return messages;
}
