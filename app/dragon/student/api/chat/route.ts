import { NextRequest } from "next/server";
import { StreamingTextResponse } from "ai";
import { LangChainStream } from "ai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, AIMessage } from "langchain/schema";
import { getEngineeredChatBotMessages } from "./prompts/chat-prompts/chatBotMessages";
import { getEngineeredTestBotMessages } from "./prompts/test-prompts/testBotMessages";
import { type BaseMessage } from "langchain/schema";
import { countPromptTokens, filterMessagesByTokenLimit } from "./utils";
import { saveBotChatToDatabase } from "./mutations";

// export const runtime = "edge";
export const dynamic = "force-dynamic";
export const maxDuration = 180;

const getEngineeredMessages = async (
  chatType: string,
  botChatId: string,
  context: any
) => {
  const parsedContext = JSON.parse(context);
  if (chatType === "chat") {
    return await getEngineeredChatBotMessages(botChatId, parsedContext);
  } else if (chatType === "test") {
    return await getEngineeredTestBotMessages(botChatId, parsedContext);
  }
  return [];
};

export async function POST(req: NextRequest) {
  const json = await req.json();
  let { messages } = json;
  const botChatId = json.chatId;
  const context = json.context;
  const botType = json.type;
  if (!botType) {
    throw new Error(`BotConfig with botChatId ${botChatId} not found`);
  }
  const engineeredMessages = await getEngineeredMessages(
    botType,
    botChatId,
    context
  );

  const { stream, handlers, writer } = LangChainStream({
    async onCompletion(completion) {
      await saveBotChatToDatabase(botChatId, completion, messages);
    },
  });

  const llm = new ChatOpenAI({
    streaming: true,
    modelName: "gpt-3.5-turbo-1106",
  });

  const history: BaseMessage[] = messages.map((m: any) =>
    m.role == "user" ? new HumanMessage(m.content) : new AIMessage(m.content)
  );

  const array = [...engineeredMessages, ...history];

  // const { promptTokens, cost } = countPromptTokens(array, llm.modelName);

  // const messagesNew = filterMessagesByTokenLimit(array, 3500, llm.modelName);

  // const { promptTokens: newPromptTokens } = countPromptTokens(
  //   array,
  //   llm.modelName
  // );
  llm.call(array, {}, [handlers]).catch(console.error);

  return new StreamingTextResponse(stream);
}
