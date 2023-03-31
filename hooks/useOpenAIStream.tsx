import { useState, useEffect, useRef } from "react";

const ROUTE = "/api/falconStream";

export default function useFalconStream(
  prompt: string,
  onMessage: (message: string) => void
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
    const fetchStream = async () => {
      try {
        const response = await fetch(ROUTE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: promptRef.current }),
        });

        if (!response.body) {
          console.error("Fetch response does not have a readable stream");
          setError("Fetch response does not have a readable stream");
          setIsLoading(false);
          return;
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
          onMessageRef.current(chunk);
        }
      } catch (error) {
        console.error("Error reading stream:", error);
        setError("Error reading stream");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStream();
  }, []);

  return { isLoading, error };
}
