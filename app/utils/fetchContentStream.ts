import { StreamPayload, PredictionPayload, QuestionPayload } from "@/types";
import { APIRoute } from "@/types";

export default async function fetchContentStream(
  onMessage: any,
  payload: StreamPayload | PredictionPayload | QuestionPayload,
  route: APIRoute
): Promise<boolean> {
  try {
    const response = await fetch(route, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.body) {
      throw new Error("Fetch response does not have a readable stream");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        return done;
      }
      const chunk = decoder.decode(value);
      onMessage(chunk);
    }
  } catch (error) {
    console.error("Error reading stream:", error);
    throw error;
  }
}
