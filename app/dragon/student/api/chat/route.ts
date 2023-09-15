import { NextRequest } from "next/server";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { ChatCompletionRequestMessage } from "openai-edge";
import { openai } from "@/app/api/lib/openAI/config";
import { LangChainStream } from "ai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, AIMessage, SystemMessage } from "langchain/schema";
import { getEngineeredMessages } from "./messages";
import { getChatContextByChatId } from "./queries";

// export const runtime = "edge";
export const dynamic = "force-dynamic";

const handleCompletion = async (completion: string, json: any) => {};

export async function POST(req: NextRequest) {
  const json = await req.json();
  console.log("json", json);
  let { messages } = json;
  const chatId = json.chatId;
  console.log("json", chatId);
  const botConfig = await getChatContextByChatId(chatId);
  console.log(json);
  console.log("id", chatId);
  console.log("messages", messages);
  console.log(botConfig);

  const engineeredMessages = await getEngineeredMessages(botConfig);

  const { stream, handlers, writer } = LangChainStream({
    async onCompletion(completion) {
      await handleCompletion(completion, json);
    },
  });

  const llm = new ChatOpenAI({
    streaming: true,
  });

  const history = messages.map((m: any) =>
    m.role == "user" ? new HumanMessage(m.content) : new AIMessage(m.content)
  );

  // const botPreferences =

  const array = [...engineeredMessages, ...history];

  llm.call(array, {}, [handlers]).catch(console.error);

  return new StreamingTextResponse(stream);
}
