import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { useAtom } from "jotai";
import {
  contentStreamCompletedAtom,
  fetchedContentAtom,
  contentStreamAtom,
} from "@/app/atoms/lesson";
import fetchContentStream from "@/app/utils/fetchContentStream";
import { aidType, PredictionPayload, StreamPayload } from "@/types";

export function useContentStream() {
  const [currentStreamId, setCurrentStreamId] = useState<string>("");
  const [prevStreamId, setPrevStreamId] = useState<string>("");
  const [contentStream, setContentStream] = useAtom(contentStreamAtom);
  const [contentStreamCompleted, setContentStreamCompleted] = useAtom(
    contentStreamCompletedAtom
  );
  const [fetchedContent, setFetchedContent] = useAtom(fetchedContentAtom);

  const fetchData = async (payload: StreamPayload | PredictionPayload) => {
    try {
      const done = await fetchContentStream((message: string) => {
        setContentStream((prevContent) => [...prevContent, message]);
      }, payload);
      if (done) {
        setContentStreamCompleted(true);
        setCurrentStreamId(uuid());
      }
    } catch (error) {
      console.error(error);
    }
  };

  const startGeneration = (payload: StreamPayload | PredictionPayload) => {
    setContentStream([]);
    setContentStreamCompleted(false);
    fetchData(payload);
  };

  useEffect(() => {
    setPrevStreamId(uuid()); // Jugaad here -> the previous id should be generated from actual previous stream
    setFetchedContent(contentStream);
  }, [contentStreamCompleted]);

  return {
    contentStream,
    startGeneration,
    currentStreamId,
    prevStreamId,
  };
}
