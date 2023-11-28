import type { BaseMessage } from "langchain/schema";
import { GPTTokens } from "gpt-tokens";
import type { supportModelType } from "gpt-tokens";
import { MessageContent } from "langchain/schema";

import { AIMessage, SystemMessage } from "langchain/schema";

export function countPromptTokens(array: BaseMessage[], modelName: string) {
  const model = modelName as supportModelType;
  const transformedMessages = array.map((message) => {
    type MessageRole = "user" | "assistant" | "system";

    const role: MessageRole =
      message instanceof AIMessage
        ? "assistant"
        : message instanceof SystemMessage
        ? "system"
        : "user";

    const messageTestSt = message.content;
    //TODO: Rework this to use for images
    const messageText =
      typeof message.content === "string" ? message.content : "";

    return {
      role,
      content: messageText,
    };
  });

  const gptTokens = new GPTTokens({
    model: model,
    messages: transformedMessages,
  });
  const promptTokens = gptTokens.promptUsedTokens;
  const cost = gptTokens.usedUSD;

  return {
    promptTokens,
    cost,
  };
}

export function filterMessagesByTokenLimit(
  messages: BaseMessage[],
  tokenLimit: number,
  modelName: string
): BaseMessage[] {
  let filteredMessages: BaseMessage[] = [];
  let currentTokens = 0;

  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    const tempArray = [message, ...filteredMessages];

    const { promptTokens } = countPromptTokens(tempArray, modelName);

    if (promptTokens <= tokenLimit) {
      filteredMessages.unshift(message);
      currentTokens = promptTokens;
    } else {
      break; // Stop adding more messages if the next one will exceed the token limit
    }
  }

  return filteredMessages;
}

// From docs
/**
 * https://www.npmjs.com/package/gpt-tokens
 * Tokens calculation rules for prompt and completion:

 * If the role of the last element of messages is not assistant, the entire messages will be regarded as a prompt, and all content will participate in the calculation of tokens

 * If the role of the last element of messages is assistant, the last message is regarded as the completion returned by openai, and only the 'content' content in the completion participates in the calculation of tokens
 */
