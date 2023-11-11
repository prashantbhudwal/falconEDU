import { NextRequest } from "next/server";
import { StreamingTextResponse } from "ai";
import { LangChainStream } from "ai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, AIMessage } from "langchain/schema";
import { getEngineeredChatBotMessages } from "./prompts/chat-prompts/chatBotMessages";
import { getEngineeredTestBotMessages } from "./prompts/test-prompts/testBotMessages";
import { getChatContextByChatId } from "./prompts/chat-prompts/queries";
import { type BaseMessage } from "langchain/schema";
import { countPromptTokens, filterMessagesByTokenLimit } from "./utils";
import { saveBotChatToDatabase } from "./mutations";
import { getBotConfigTypeByBotChatId } from "./prompts/chat-prompts/queries";

// export const runtime = "edge";
export const dynamic = "force-dynamic";

const getEngineeredMessages = async (chatType: string, botChatId: string) => {
  if (chatType === "chat") {
    return await getEngineeredChatBotMessages(botChatId);
  } else if (chatType === "test") {
    return await getEngineeredTestBotMessages(botChatId);
  }
  return [];
};

export async function POST(req: NextRequest) {
  const json = await req.json();
  let { messages } = json;
  const botChatId = json.chatId;

  const botType = await getBotConfigTypeByBotChatId(botChatId);

  if (!botType) {
    throw new Error(`BotConfig with botChatId ${botChatId} not found`);
  }
  const engineeredMessages = await getEngineeredMessages(botType, botChatId);

  const { stream, handlers, writer } = LangChainStream({
    async onCompletion(completion) {
      // console.log("completion", completion);
      await saveBotChatToDatabase(botChatId, completion, messages);
    },
  });

  const llm = new ChatOpenAI({
    streaming: true,
  });

  const history: BaseMessage[] = messages.map((m: any) =>
    m.role == "user" ? new HumanMessage(m.content) : new AIMessage(m.content)
  );

  const array = [...engineeredMessages, ...history];

  const { promptTokens, cost } = countPromptTokens(array, llm.modelName);
  // console.log("promptTokens", promptTokens);

  const messagesNew = filterMessagesByTokenLimit(array, 3500, llm.modelName);
  // console.log("messagesNew", messagesNew);

  const { promptTokens: newPromptTokens } = countPromptTokens(
    messagesNew,
    llm.modelName
  );
  // console.log("newPromptTokens", newPromptTokens);

  llm.call(array, {}, [handlers]).catch(console.error);

  return new StreamingTextResponse(stream);
}
