import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { useAtom } from "jotai";
import {
  contentStreamCompletedAtom,
  fetchedContentAtom,
  contentStreamAtom,
} from "@/app/atoms/lesson";
import fetchContentStream from "@/app/utils/fetchContentStream";
import { aidType, StreamPayload } from "@/types";

export function useContentStream() {
  const [currentStreamId, setCurrentStreamId] = useState<string>("");
  const [prevStreamId, setPrevStreamId] = useState<string>("");
  const [contentStream, setContentStream] = useAtom(contentStreamAtom);
  const [contentStreamCompleted, setContentStreamCompleted] = useAtom(
    contentStreamCompletedAtom
  );
  const [fetchedContent, setFetchedContent] = useAtom(fetchedContentAtom);

  const fetchData = async (payload: StreamPayload) => {
    try {
      fetchContentStream(
        (message: string) => {
          setContentStream((prevContent) => [...prevContent, message]);
        },
        payload,
        () => setContentStreamCompleted(true),
        () => setCurrentStreamId(uuid())
      );
    } catch (error) {
      console.error(error);
    }
  };

  const startGeneration = (payload: StreamPayload) => {
    setContentStream([]);
    setContentStreamCompleted(false);
    fetchData(payload);
  };

  useEffect(() => {
    setPrevStreamId(currentStreamId);
    setFetchedContent(contentStream);
  }, [contentStreamCompleted]);

  return {
    contentStream,
    startGeneration,
    currentStreamId,
    prevStreamId,
  };
}
