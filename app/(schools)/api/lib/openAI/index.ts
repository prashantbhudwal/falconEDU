import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";

export async function streamFromOpenAI(payload: any) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const response = await fetch(API_URL, payload);

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
