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
import axios from "axios";
import { ChatCompletionCreateParams } from "openai/resources";
// export const runtime = "edge";
export const dynamic = "force-dynamic";

async function searchYouTubeVideo(
  query: string,
  maxResults = 5,
  order = "relevance"
) {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          q: query,
          maxResults: maxResults,
          order: order,
          key: process.env.GOOGLE_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error during YouTube API call:", error);
    throw error;
  }
}

const functions: ChatCompletionCreateParams.Function[] = [
  {
    name: "search_youtube_video",
    description:
      "Search for a Khan Academy YouTube video based on a user's query",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "The search query for finding a video on YouTube. Video will be from Khan Academy.",
        },
        // maxResults: {
        //   type: "integer",
        //   description: "The maximum number of search results to return",
        //   default: 5,
        // },
        // order: {
        //   type: "string",
        //   enum: [
        //     "date",
        //     "rating",
        //     "relevance",
        //     "title",
        //     "videoCount",
        //     "viewCount",
        //   ],
        //   description: "The order to display search results",
        //   default: "relevance",
        // },
        // apiKey: {
        //   type: "string",
        //   description: "API key for accessing YouTube Data API",
        // },
      },
      required: ["query", "apiKey"],
    },
  },
];

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
      functions,
    });

    const newStream = OpenAIStream(completion, {
      experimental_onFunctionCall: async (
        { name, arguments: args },
        createFunctionCallMessages
      ) => {
        if (name === "search_youtube_video") {
          const video = await searchYouTubeVideo(args.query as string);
          const newMessages = createFunctionCallMessages(video);
          return openai.chat.completions.create({
            messages: [...messages, ...newMessages],
            stream: true,
            model: "gpt-3.5-turbo-1106",
            // functions,
          });
        }
      },
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
