import { useState, useEffect, useRef } from "react";

const ROUTE = "/api/falconStream";

const fetchStream = async function (prompt: any, onMessage: any) {
  try {
    const response = await fetch(ROUTE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
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
  fetchComplete: ()=> void 
) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const promptRef = useRef(prompt);
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    promptRef.current = prompt;
    onMessageRef.current = onMessage;
  }, [prompt, onMessage]);

  useEffect(() => {
    if (fetchNow) {
      const fetchData = async () => {
        try {
          await fetchStream(promptRef.current, onMessageRef.current);
        } catch (error) {
          setError("Error reading stream");
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
      fetchComplete()
    }
  }, [fetchNow]);

  return { isLoading, error };
}
