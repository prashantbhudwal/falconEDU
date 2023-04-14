import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { useAtom } from "jotai";
import {
  contentStreamCompletedAtom,
  lessonToDownloadAtom,
  contentStreamAtom,
  teachingAidsAtom,
} from "@/app/atoms/lesson";
import fetchContentStream from "@/app/utils/fetchContentStream";
import { StreamPayload } from "@/types";

export function useContentStream(fetchNow: boolean, payload: StreamPayload) {
  const [currentBlockId, setCurrentBlockId] = useState<string>("");
  const [lastBlockId, setLastBlockId] = useState<string>("");
  const [contentStream, setContentStream] = useAtom(contentStreamAtom);
  const [teachingAids, setTeachingAids] = useAtom(teachingAidsAtom);
  const [contentStreamCompleted, setContentStreamCompleted] = useAtom(
    contentStreamCompletedAtom
  );
  const [lessonToDownload, setLessonToDownload] = useAtom(lessonToDownloadAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      await fetchContentStream(
        (message: string) => {
          setContentStream((prevContent) => [...prevContent, message]);
        },
        payload,
        () => setContentStreamCompleted(true),
        () => setCurrentBlockId(uuid())
      );
    } catch (error) {
      setError("Error reading stream");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (fetchNow === false) return;
    setContentStream([]);
    setContentStreamCompleted(false);
    fetchData();
  }, [fetchNow]);

  useEffect(() => {
    if (
      contentStreamCompleted === true &&
      contentStream.length > 0 &&
      currentBlockId != lastBlockId
    ) {
      const randomId = uuid();
      setTeachingAids((prevAid) => [
        ...prevAid,
        {
          content: contentStream,
          id: randomId,
          name: "lessonPlan",
        },
      ]);
      setLastBlockId(currentBlockId);
      setLessonToDownload(contentStream);
    }
  }, [contentStreamCompleted]);

  return {
    contentStream,
    contentStreamCompleted,
  };
}
