import { useState, useEffect, useRef } from "react";
import { useAppState } from "@/app/context/app-context";

const ROUTE = "/api/falconStream";

type RequestBody = {
  topic: string;
  subtopic: string;
  grade: string;
  promptType: string;
};

const fetchStream = async function (
  prompt: any,
  onMessage: any,
  body: RequestBody
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
  prompt: string,
  onMessage: (message: string) => void,
  fetchNow: boolean,
  fetchComplete: () => void,
  blockType: string
) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const promptRef = useRef(prompt);
  const onMessageRef = useRef(onMessage);
  const { topic, subtopic, grade } = useAppState();

  const body = {
    topic: topic,
    subtopic: subtopic,
    grade: grade,
    promptType: blockType,
  };

  useEffect(() => {
    promptRef.current = prompt;
    onMessageRef.current = onMessage;
  }, [prompt, onMessage]);

  useEffect(() => {
    if (fetchNow) {
      const fetchData = async () => {
        try {
          await fetchStream(promptRef.current, onMessageRef.current, body);
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
