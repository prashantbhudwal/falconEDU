import { StreamPayload, PredictionPayload } from "@/types";

const ROUTE = "/api/contentStreamOnEdge";
export default async function fetchContentStream(
  onMessage: any,
  payload: StreamPayload | PredictionPayload
): Promise<boolean> {
  try {
    const response = await fetch(ROUTE, {
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
