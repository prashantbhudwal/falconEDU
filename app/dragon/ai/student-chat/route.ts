import { NextRequest } from "next/server";
import OpenAI from "openai";
const openai = new OpenAI();
import { OpenAIStream, StreamingTextResponse } from "ai";
import { HumanMessage, AIMessage } from "langchain/schema";
import { getEngineeredChatBotMessages } from "./prompts/chat-prompts/chatBotMessages";
import { getEngineeredTestBotMessages } from "./prompts/test-prompts/testBotMessages";
import { type BaseMessage } from "langchain/schema";
import { countPromptTokens, filterMessagesByTokenLimit } from "./utils";
import { saveBotChatToDatabase } from "./mutations";

// export const runtime = "edge";
export const dynamic = "force-dynamic";
export const maxDuration = 180;

//TODO - this is a big jugaad, need to fix this, either use LangChain or OpenAI Format, don't mix both
function formatLangchainMessagesForOpenAI(messages: BaseMessage[]) {
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

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    let { messages } = json;
    const botChatId = json.chatId;
    const context = json.context;
    const botType = json.type;
    if (!botType) {
      throw new Error(`BotConfig with botChatId ${botChatId} not found`);
    }
    const parsedContext = JSON.parse(context);

    console.log("1. context parsed", parsedContext);

    const { engineeredMessages } =
      botType === "chat"
        ? await getEngineeredChatBotMessages(parsedContext)
        : await getEngineeredTestBotMessages(parsedContext);

    console.log("2. engineered messages fetched", engineeredMessages);

    const TEMPERATURE = botType === "chat" ? 1 : 0.2;

    const history: BaseMessage[] = messages.map((m: any) =>
      m.role == "user" ? new HumanMessage(m.content) : new AIMessage(m.content)
    );

    const langChainMessageArray = [...engineeredMessages, ...history];

    console.log("3. messages combined", langChainMessageArray);

    const openAiFormatMessages = formatLangchainMessagesForOpenAI(
      langChainMessageArray
    );

    console.log("4. messages formatted", openAiFormatMessages);

    const completion = await openai.chat.completions.create({
      stream: true,
      temperature: TEMPERATURE,
      messages: openAiFormatMessages,
      model: "gpt-3.5-turbo-1106",
    });

    console.log("5. completion fetched");

    const newStream = OpenAIStream(completion, {
      async onCompletion(completion) {
        await saveBotChatToDatabase(botChatId, completion, messages);
      },
    });
    console.log("6. new stream created");
    return new StreamingTextResponse(newStream);
  } catch (e) {
    return new Response("Error", { status: 500 });
    console.log("error", e);
  }
}
//TODO - implement token limit filtering
// const { promptTokens, cost } = countPromptTokens(array, llm.modelName);

// const messagesNew = filterMessagesByTokenLimit(array, 3500, llm.modelName);

// const { promptTokens: newPromptTokens } = countPromptTokens(
//   array,
//   llm.modelName
// );
