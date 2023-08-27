import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { useAtom } from "jotai";
import {
  contentStreamCompletedAtom,
  fetchedContentAtom,
  contentStreamAtom,
  currentStreamIdAtom,
  prevStreamIdAtom,
} from "@/lib/atoms/lesson";
import fetchContentStream from "@/lib/fetchContentStream";
import {
  aidType,
  APIRoute,
  PredictionPayload,
  StreamPayload,
  QuestionPayload,
  ContentStreamPayload,
} from "@/types";

export function useContentStream(apiRoute: APIRoute) {
  const [currentStreamId, setCurrentStreamId] = useAtom(currentStreamIdAtom);
  const [prevStreamId, setPrevStreamId] = useAtom(prevStreamIdAtom);
  const [contentStream, setContentStream] = useState<string[]>([]);
  const [contentStreamCompleted, setContentStreamCompleted] = useAtom(
    contentStreamCompletedAtom
  );
  const [fetchedContent, setFetchedContent] = useState<string[]>([]);

  const fetchData = async (payload: ContentStreamPayload) => {
    try {
      const done = await fetchContentStream(
        (message: string) => {
          setContentStream((prevContent) => [...prevContent, message]);
        },
        payload,
        apiRoute
      );
      if (done) {
        setContentStreamCompleted(true);
        setCurrentStreamId(uuid());
      }
    } catch (error) {
      console.error(error);
    }
  };

  const startGeneration = (payload: ContentStreamPayload) => {
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
