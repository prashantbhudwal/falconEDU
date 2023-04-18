// app/api/route.ts
import { NextRequest } from "next/server";
import { getCompletionStream, handleGPT3TurboStreamData } from "../lib/openAI";
import { ChatCompletionRequestMessage } from "openai";
import { IdeaStreamPayload } from "@/types";
import { getChatMessages } from "../lib/ideaChatGenerator";

export const runtime = "nodejs";
// This is required to enable streaming
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const payload: IdeaStreamPayload = await request.json();
  const messages: ChatCompletionRequestMessage[] = getChatMessages(payload);
  let responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  try {
    const openaiRes = await getCompletionStream(messages);
    // console.log(openaiRes.headers["x-request-id"]);
    // @ts-ignore
    openaiRes.data.on("data", (data: Buffer) =>
      handleGPT3TurboStreamData(data, writer)
    );
  } catch (error) {
    console.error("An error occurred during OpenAI request", error);
    const encoder = new TextEncoder();
    writer.write(encoder.encode("An error occurred during OpenAI request"));
    writer.close();
  }
  return new Response(responseStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
