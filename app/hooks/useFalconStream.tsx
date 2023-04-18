import { useState, useEffect, useRef } from "react";
import { v4 as uuid } from "uuid";
import { useAtom } from "jotai";
import { topicAtom, subtopicAtom, gradeAtom } from "../atoms/preferences";
import { IdeaStreamPayload } from "@/types";
import { ideaType } from "@/types";

const ROUTE = "/api/falconStream";

const fetchStream = async function (
  onMessage: any,
  body: IdeaStreamPayload,
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
  blockType: ideaType
) {
  const [isLoading, setIsLoading] = useState(!fetchNow);
  const [error, setError] = useState<string | null>(null);
  const onMessageRef = useRef(onMessage);
  const [topic] = useAtom(topicAtom);
  const [subtopic] = useAtom(subtopicAtom);
  const [grade] = useAtom(gradeAtom);

  const body: IdeaStreamPayload = {
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
