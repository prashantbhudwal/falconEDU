import { IdeaStreamPayload } from "@/types";
import { PredictionPayload } from "@/types";
import { type ChatCompletionRequestMessage } from "openai-edge";
function getFormatEngineeredMessages(): ChatCompletionRequestMessage[] {
  return [
    {
      role: "system",
      content: `You are a prediction assistant that always gives me responses in a described format. I am putting this output directly in code, so don't mess it up.`,
    },
    {
      role: "assistant",
      content: `Okay. What is the format?`,
    },
    {
      role: "user",
      content: `Always answer in "Underscore Separated Values", each value starts with a $$ and ends with a $$, and nothing else, no comments, no conclusions, nothing. No adding comments like, here is a list. The response should just have a list and that's it. That is your responses are always continuous strings. For example: "$$Topic 1$$_$$Topic 2$$_$$Topic 3$$_$$Topic 4$$". Show me you know the format by giving me any four topics.`,
    },
    {
      role: "assistant",
      content: `$$Topic 1$$_$$Topic 2$$_$$Topic 3$$_$$Topic 4$$`,
    },
  ];
}

export function getChapterMessages(
  payload: PredictionPayload
): ChatCompletionRequestMessage[] {
  const { grade, subject, board } = payload.data;
  const formatEngineeredMessages = getFormatEngineeredMessages();
  return [
    ...formatEngineeredMessages,
    {
      role: "user",
      content: `Okay, perfect format. Now, I want to teach "${subject}" to grade ${grade}, ${board} students in India. Give me chapters to focus on.`,
    },
  ];
}

export function getSubtopicMessages(
  payload: PredictionPayload
): ChatCompletionRequestMessage[] {
  const { grade, subject, board, topic } = payload.data;
  const formatEngineeredMessages = getFormatEngineeredMessages();

  return [
    ...formatEngineeredMessages,
    {
      role: "user",
      content: `Okay, perfect format. Now, I want to teach "${subject}" to grade ${grade}, ${board} students in India.  I am focusing on the chapter "${topic}". Give topics to focus on from this chapter.`,
    },
  ];
}
