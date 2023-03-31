// app/api/route.ts
import { NextRequest } from "next/server";
import { getCompletionStream } from "../openAI";
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
  const encoder = new TextEncoder();

  // writer.write(encoder.encode("streaming")); // Send "streaming" message to the client

  try {
    const openaiRes = await getCompletionStream(messages);

    // @ts-ignore
    openaiRes.data.on("data", async (data: Buffer) => {
      const lines = data
        .toString()
        .split("\n")
        .filter((line: string) => line.trim() !== "");
      for (const line of lines) {
        const message = line.replace(/^data: /, "");
        if (message === "[DONE]") {
          console.log("Stream completed");
          writer.close();
          return;
        }
        try {
          const parsed = JSON.parse(message);
          console.log(parsed);
          console.log(parsed.choices[0].delta);
          const filteredContent = parsed.choices[0].delta.content
            ? parsed.choices[0].delta?.content
            : "";

          await writer.write(encoder.encode(`${filteredContent}`));
        } catch (error) {
          console.error("Could not JSON parse stream message", message, error);
        }
      }
    });
  } catch (error) {
    console.error("An error occurred during OpenAI request", error);
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
