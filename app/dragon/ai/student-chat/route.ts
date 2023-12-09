import { NextRequest } from "next/server";
import OpenAI from "openai";
const openai = new OpenAI();
import { OpenAIStream, StreamingTextResponse } from "ai";
import { HumanMessage, AIMessage } from "langchain/schema";
import { getEngineeredChatBotMessages } from "./prompts/chat-prompts/chatBotMessages";
import { getEngineeredTestBotMessages } from "./prompts/test-prompts/testBotMessages";
import { type BaseMessage } from "langchain/schema";
import { saveBotChatToDatabase } from "./mutations";
import { TokenTextSplitter } from "langchain/text_splitter";
import { mp } from "@/lib/mixpanel";
// export const runtime = "edge";
export const dynamic = "force-dynamic";

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

    const { engineeredMessages } =
      botType === "chat"
        ? await getEngineeredChatBotMessages(parsedContext)
        : await getEngineeredTestBotMessages(parsedContext);

    const TEMPERATURE = botType === "chat" ? 1 : 0.2;

    const history: BaseMessage[] = messages.map((m: any) =>
      m.role == "user" ? new HumanMessage(m.content) : new AIMessage(m.content)
    );

    // Only keep the last 20 messages
    const relevantHistory = history.slice(-20);

    const langChainMessageArray = [...engineeredMessages, ...relevantHistory];

    const openAiFormatMessages = formatLangchainMessagesForOpenAI(
      langChainMessageArray
    );

    const completion = await openai.chat.completions.create({
      stream: true,
      temperature: TEMPERATURE,
      messages: openAiFormatMessages,
      model: "gpt-3.5-turbo",
    });

    const newStream = OpenAIStream(completion, {
      async onCompletion(completion) {
        await saveBotChatToDatabase(botChatId, completion, messages);
        mp.track("Student Message", {
          distinct_id: botChatId,
          botType: botType,
        });
      },
    });

    return new StreamingTextResponse(newStream);
  } catch (e) {
    console.log(e);
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
