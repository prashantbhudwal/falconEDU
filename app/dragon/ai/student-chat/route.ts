import { NextRequest } from "next/server";
import { getTaskProperties } from "../../teacher/utils";
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
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { TaskType } from "@/types/dragon";
import { getEngineeredLessonBotMessages } from "./prompts/lesson-prompts/lessonBotMessages";
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

const getEngineeredMessagesByType = async ({
  type,
  context,
}: {
  type: TaskType;
  context: any;
}) => {
  switch (type) {
    case "chat":
      return await getEngineeredChatBotMessages(context);
    case "test":
      return await getEngineeredTestBotMessages(context);
    case "lesson":
      return await getEngineeredLessonBotMessages(context);
    default:
      return await getEngineeredChatBotMessages(context);
  }
};

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const email = session.user.email;

  try {
    const json = await req.json();
    let { messages } = json;
    const botChatId = json.chatId;
    const context = json.context;
    const botType = json.type as TaskType;
    if (!botType) {
      throw new Error(`BotConfig with botChatId ${botChatId} not found`);
    }
    const parsedContext = JSON.parse(context);

    const { engineeredMessages } = await getEngineeredMessagesByType({
      type: botType,
      context: parsedContext,
    });

    const TEMPERATURE = getTaskProperties(botType).aiTemperature;

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
      model: "gpt-3.5-turbo-1106",
    });

    const newStream = OpenAIStream(completion, {
      async onCompletion(completion) {
        await saveBotChatToDatabase(botChatId, completion, messages);
        mp.track(
          `${botType.charAt(0).toUpperCase() + botType.slice(1)} Message`,
          {
            distinct_id: email,
            botType: botType,
            teacherName: parsedContext.teacherName ?? "",
            studentName: parsedContext.studentName ?? "",
          }
        );
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
