import endent from "endent";
import {
  ChatCompletionAssistantMessageParam,
  ChatCompletionMessageParam,
} from "openai/resources";
import { ContentAPIRequestBody } from "../route";
import { getContentGenerationMessages } from "./content-generation";

export const getContentModificationMessages = (
  context: ContentAPIRequestBody,
): ChatCompletionMessageParam[] => {
  const { prompt } = context;
  const initialMessages = getContentGenerationMessages(context);
  const latestMessage: ChatCompletionAssistantMessageParam = {
    role: "assistant",
    content: context.lastGeneratedContent,
  };

  const historicalContext = [...initialMessages, latestMessage];

  const engineeredMessages: ChatCompletionMessageParam[] = [
    ...historicalContext,
    {
      role: "user",
      content: prompt,
    },
  ];
  return engineeredMessages;
};
