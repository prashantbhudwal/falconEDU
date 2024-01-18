import type { BaseMessage } from "langchain/schema";
import { GPTTokens } from "gpt-tokens";
import type { supportModelType } from "gpt-tokens";
import { HumanMessage, MessageContent } from "langchain/schema";

import { AIMessage, SystemMessage } from "langchain/schema";
import { getEngineeredChatBotMessages } from "./prompts/chat-prompts/chatBotMessages";
import {
  TestContextByChatId,
  getEngineeredTestBotMessages,
} from "./prompts/test-prompts/testBotMessages";
import { getEngineeredAITestBotMessages } from "./prompts/ai-test-prompts/AITestBotMessages";
import { getEngineeredLessonBotMessages } from "./prompts/lesson-prompts/lessonBotMessages";
import { LessonContextByChatId } from "./prompts/lesson-prompts/queries";
import { ChatContextByChatId } from "./prompts/chat-prompts/queries";
import { TaskType } from "@/types";
import { AITestContextByChatId } from "./prompts/ai-test-prompts/queries";
import zodToJsonSchema from "zod-to-json-schema";
import {
  CustomJsonSchema,
  FunctionDefinition,
  ToolWithCallback,
  toolName,
} from "./tools/types";
import { z } from "zod";

export function mapMessagesToLangChainBaseMessage(
  messages: any[]
): BaseMessage[] {
  return messages.map((m: any) =>
    m.role == "user" ? new HumanMessage(m.content) : new AIMessage(m.content)
  );
}

export const getEngineeredMessagesByType = async ({
  type,
  context,
}: {
  type: TaskType;
  context: any;
}) => {
  switch (type) {
    case "chat":
      return await getEngineeredChatBotMessages(context as ChatContextByChatId);
    case "test":
      return await getEngineeredTestBotMessages(context as TestContextByChatId);
    case "lesson":
      return await getEngineeredLessonBotMessages(
        context as LessonContextByChatId
      );
    case "ai-test":
      return await getEngineeredAITestBotMessages(
        context as AITestContextByChatId
      );
    default:
      return await getEngineeredChatBotMessages(context);
  }
};

export function formatLangchainMessagesForOpenAI(messages: BaseMessage[]) {
  return messages.map((m: BaseMessage) => {
    let role: "user" | "assistant" | "system";
    if (m._getType() === "human") {
      role = "user";
    } else if (m._getType() === "ai") {
      role = "assistant";
    } else if (m._getType() === "system") {
      role = "system";
    } else {
      role = "user";
    }
    return { role, content: m.content as string };
  });
}

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

export const zodSchemaToOpenAIParameters = (zodSchema: z.ZodSchema<any>) => {
  const jsonSchema = zodToJsonSchema(zodSchema);
  // Removing $schema and additionalProperties from the schema to save tokens
  const { $schema, additionalProperties, ...parameters } =
    jsonSchema as CustomJsonSchema;
  return parameters;
};

export const createToolWithCallback = function ({
  name,
  description,
  schema,
  callback,
  type = "function",
}: {
  name: toolName;
  description: string;
  schema: z.ZodSchema<any>;
  callback: Function;
  type: "function";
}): ToolWithCallback {
  const functionDefinition: FunctionDefinition = {
    name,
    description,
    parameters: zodSchemaToOpenAIParameters(schema),
  };
  return {
    name,
    tool: {
      type: type,
      function: functionDefinition,
    },
    callback,
  };
};
