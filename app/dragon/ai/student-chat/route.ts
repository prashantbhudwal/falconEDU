import { NextRequest } from "next/server";
import { getTaskProperties } from "../../../../lib/helpers";
import OpenAI from "openai";
const openai = new OpenAI();
import {
  OpenAIStream,
  StreamingTextResponse,
  experimental_StreamData,
} from "ai";
import { saveBotChatToDatabase } from "./mutations";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { TaskType } from "@/types/dragon";
export type ToolData = {
  type: "tool_call";
  tool_call_id: string;
  function_name: toolName;
  tool_call_result: any;
};

// export const runtime = "edge";
export const dynamic = "force-dynamic";
import { toolName } from "./tools/types";
import { findToolsByTask } from "./tools";
import { getEngineeredMessagesByType } from "./prompts";
import { trackEvent } from "@/lib/mixpanel";

const MESSAGES_IN_CONTEXT_WINDOW = 50;

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const email = session.user.email;
  const json = await req.json();
  let { messages, chatId: botChatId, context, isTesting } = json;
  const botType = json.type as TaskType;
  if (!botType) {
    throw new Error(`BotConfig with botChatId ${botChatId} not found`);
  }
  const temperature = getTaskProperties(botType).aiTemperature;
  const model = "gpt-3.5-turbo-1106";

  try {
    const parsedContext = JSON.parse(context);

    const { engineeredMessages } = await getEngineeredMessagesByType({
      type: botType,
      context: parsedContext,
    });

    const relevantHistory = messages.slice(-MESSAGES_IN_CONTEXT_WINDOW);
    const messageArray = [...engineeredMessages, ...relevantHistory];

    const { tools, toolsWithCallback } = findToolsByTask(botType);

    const completion = await openai.chat.completions.create({
      stream: true,
      temperature,
      messages: messageArray,
      model,
      tools,
      tool_choice: !!tools ? "auto" : undefined,
    });
    const data = new experimental_StreamData();
    const newStream = OpenAIStream(completion, {
      experimental_onToolCall: async (
        toolCallPayload,
        appendToolCallMessage,
      ) => {
        const tools = toolCallPayload.tools;

        const toolCallPromises = tools.map(async (tool) => {
          const toolName = tool.func.name as toolName;
          trackEvent("student", "tool_used", {
            distinct_id: email as string,
            tool_name: toolName,
            task_type: botType,
            attempt_id: botChatId,
            model: model,
            temperature: temperature,
          });

          // TODO - fix this: Even though the types says record<string, unknown>, it's actually a string
          let args;
          // @ts-ignore
          if (typeof tool.func.arguments === "string")
            args = JSON.parse(tool.func.arguments);
          else args = tool.func.arguments;

          const myTool = toolsWithCallback?.find(
            (tool) => tool.name === toolName,
          );
          const callBack = myTool?.callback;
          if (!callBack) {
            throw new Error(`Tool ${toolName} not found`);
          }

          const toolResult = await callBack(args);

          appendToolCallMessage({
            tool_call_id: tool.id,
            function_name: tool.func.name,
            tool_call_result: toolResult,
          });
          const toolData: ToolData = {
            type: "tool_call",
            tool_call_id: tool.id,
            function_name: toolName,
            tool_call_result: toolResult,
          };
          data.append(toolData);
        });
        await Promise.all(toolCallPromises);
        const appendedMessages = appendToolCallMessage();
        const functionCompletion = await openai.chat.completions.create({
          messages: [...messageArray, ...appendedMessages],
          stream: true,
          model,
          temperature,
          // functions,
        });
        return functionCompletion;
      },
      async onCompletion(completion) {
        if (isTesting) {
          return;
        }
        const test = await saveBotChatToDatabase(
          botChatId,
          completion,
          messages,
        );
        trackEvent("student", "message_sent", {
          distinct_id: email as string,
          task_type: botType,
          attempt_id: botChatId,
          model: model,
          temperature: temperature,
        });
      },
      onFinal(completion) {
        // IMPORTANT! you must close StreamData manually or the response will never finish.
        data.close();
      },
      // IMPORTANT! until this is stable, you must explicitly opt in to supporting streamData.
      experimental_streamData: true,
    });

    return new StreamingTextResponse(newStream, {}, data);
  } catch (e) {
    trackEvent("student", "chat_completion_failed", {
      distinct_id: email as string,
      task_type: botType,
      attempt_id: botChatId,
      model: model,
      temperature: temperature,
      isError: true,
    });
    console.error(e);
    return new Response("Error", { status: 500 });
  }
}
//TODO - implement token limit filtering
// const { promptTokens, cost } = countPromptTokens(array, llm.modelName);

// const messagesNew = filterMessagesByTokenLimit(array, 3500, llm.modelName);

// const { promptTokens: newPromptTokens } = countPromptTokens(
//   array,
//   llm.modelName
// );
