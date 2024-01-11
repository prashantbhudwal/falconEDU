import { NextRequest } from "next/server";
import { getTaskProperties } from "../../teacher/utils";
import OpenAI from "openai";
const openai = new OpenAI();
import { OpenAIStream, StreamingTextResponse } from "ai";
import { saveBotChatToDatabase } from "./mutations";
import { mp } from "@/lib/mixpanel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { TaskType } from "@/types/dragon";
import { ChatCompletionCreateParams } from "openai/resources";
import {
  formatLangchainMessagesForOpenAI,
  getEngineeredMessagesByType,
  mapMessagesToLangChainBaseMessage,
} from "./utils";
import { searchYouTubeVideo } from "./tools/youtube";
// export const runtime = "edge";
export const dynamic = "force-dynamic";
import { youtubeSearchTool } from "./tools/youtube";

const functions: ChatCompletionCreateParams.Function[] = [youtubeSearchTool];

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const email = session.user.email;

  try {
    const json = await req.json();
    let { messages, chatId: botChatId, context } = json;
    const botType = json.type as TaskType;
    if (!botType) {
      throw new Error(`BotConfig with botChatId ${botChatId} not found`);
    }
    const parsedContext = JSON.parse(context);

    const { engineeredMessages } = await getEngineeredMessagesByType({
      type: botType,
      context: parsedContext,
    });

    const history = mapMessagesToLangChainBaseMessage(messages);

    // Only keep the last 20 messages
    const relevantHistory = history.slice(-20);

    const langChainMessageArray = [...engineeredMessages, ...relevantHistory];

    const openAiFormatMessages = formatLangchainMessagesForOpenAI(
      langChainMessageArray
    );

    const completion = await openai.chat.completions.create({
      stream: true,
      temperature: getTaskProperties(botType).aiTemperature,
      messages: openAiFormatMessages,
      model: "gpt-3.5-turbo-1106",
      functions: botType === "lesson" ? functions : undefined,
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
