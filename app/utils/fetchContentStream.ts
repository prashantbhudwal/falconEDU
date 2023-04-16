import { StreamPayload } from "@/types";

const ROUTE = "/api/contentStreamOnEdge";
export default async function fetchContentStream(
  onMessage: any,
  body: StreamPayload,
  streamComplete: () => void,
  setCurrentBlockId: () => void
) {
  try {
    const response = await fetch(ROUTE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.body) {
      throw new Error("Fetch response does not have a readable stream");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        console.log("Stream has completed");
        streamComplete();
        setCurrentBlockId();
        break;
      }

      const chunk = decoder.decode(value);
      onMessage(chunk);
    }
  } catch (error) {
    console.error("Error reading stream:", error);
    throw error;
  }
}
