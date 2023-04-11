import { useState, useEffect, useRef } from "react";
import { useAppState } from "@/app/context/app-context";
import { v4 as uuid } from "uuid";

const ROUTE = "/api/falconStream";

type RequestBody = {
  topic: string;
  subtopic: string;
  grade: string;
  promptType: string;
};

const fetchStream = async function (
  onMessage: any,
  body: RequestBody,
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
};

export default function useFalconStream(
  onMessage: (message: string) => void,
  fetchNow: boolean,
  fetchComplete: () => void,
  streamComplete: () => void,
  setCurrentBlockId: () => void,
  blockType: string
) {
  const [isLoading, setIsLoading] = useState(!fetchNow);
  const [error, setError] = useState<string | null>(null);
  const onMessageRef = useRef(onMessage);
  const { topic, subtopic, grade } = useAppState();

  const body = {
    topic: topic,
    subtopic: subtopic,
    grade: grade,
    promptType: blockType,
  };

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    setIsLoading(fetchNow);
  }, [fetchNow]);

  useEffect(() => {
    if (fetchNow) {
      const fetchData = async () => {
        try {
          await fetchStream(
            onMessageRef.current,
            body,
            streamComplete,
            setCurrentBlockId
          );
        } catch (error) {
          setError("Error reading stream");
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
      fetchComplete();
    }
  }, [fetchNow]);

  return { isLoading, error };
}
