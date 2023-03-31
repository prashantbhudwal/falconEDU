// app/api/route.ts
import { NextRequest } from "next/server";
import { getCompletionStream, handleGPT3TurboStreamData } from "../openAI";
import { ChatCompletionRequestMessage } from "openai";

export const runtime = "nodejs";
// This is required to enable streaming
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const prompt = body.prompt;
  const messages: ChatCompletionRequestMessage[] = [
    {
      role: "system",
      content: `You are a knowledgeable teaching assistant.`,
    },
    {
      role: "user",
      content: prompt,
    },
  ];
  let responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();

  try {
    const openaiRes = await getCompletionStream(messages);
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
