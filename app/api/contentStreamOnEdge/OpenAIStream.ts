import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";
import { lessonOptions } from "../lib/openAI/options";

export async function OpenAIStream(messages: any) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const { MODEL, TEMPERATURE, MAX_TOKENS, STREAM } = lessonOptions;
  const API_URL = "https://api.openai.com/v1/chat/completions";

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    responseType: "stream",
    body: JSON.stringify({
      model: MODEL,
      temperature: TEMPERATURE,
      max_tokens: 200, //TODO Change to variable
      messages: messages,
      stream: STREAM,
    }),
  };
  const response = await fetch(API_URL, requestOptions);

  const stream = new ReadableStream({
    async start(controller) {
      function onParse(event: ParsedEvent | ReconnectInterval) {
        if (event.type === "event") {
          const data = event.data;
          if (data === "[DONE]") {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);
            const text = json.choices[0]?.delta?.content || "";
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      }

      // stream response (SSE) from OpenAI may be fragmented into multiple chunks
      // this ensures we properly read chunks & invoke an event for each SSE event stream
      const parser = createParser(onParse);

      // https://web.dev/streams/#asynchronous-iteration
      for await (const chunk of response.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
}
