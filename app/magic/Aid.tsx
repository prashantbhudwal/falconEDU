"use client";
import { useState, useEffect, useCallback } from "react";
import { v4 as uuid } from "uuid";
import useContentStream from "@/app/hooks/useContentStream";
import AidBlock from "./AidBlock";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import {
  lessonStreamCompletedAtom,
  lessonToDownloadAtom,
  contentStreamAtom,
  teachingAidsAtom,
} from "@/app/atoms/lesson";
import { topicAtom, subtopicAtom } from "@/app/atoms/preferences";
import { BlockContent } from "@/types";

export default function Aid({ className }: { className?: string }) {
  const router = useRouter();
  const [fetchNow, setFetchNow] = useState(false);
  const [currentBlockId, setCurrentBlockId] = useState<string>("");
  const [lastBlockId, setLastBlockId] = useState<string>("");
  const [contentStream, setContentStream] = useAtom(contentStreamAtom);
  const [teachingAids, setTeachingAids] = useAtom(teachingAidsAtom);

  const [lessonStreamCompleted, setLessonStreamCompleted] = useAtom(
    lessonStreamCompletedAtom
  );
  const [lessonToDownload, setLessonToDownload] = useAtom(lessonToDownloadAtom);
  const [topic] = useAtom(topicAtom);
  const [subtopic] = useAtom(subtopicAtom);


  // Comment to pause execution of the lesson stream

  useEffect(() => {
    if (topic === "" || subtopic === "") {
      router.push("/preferences");
    }
    setContentStream([]);
    setLessonStreamCompleted(false);
    setFetchNow(true);
  }, []);

  const handleNewMessage = useCallback((message: string) => {
    setContentStream((prevContent) => [...prevContent, message]);
  }, []);

  const { isLoading, error } = useContentStream(
    handleNewMessage,
    fetchNow,
    () => setFetchNow(false),
    () => setLessonStreamCompleted(true),
    () => setCurrentBlockId(uuid())
  );

  useEffect(() => {
    if (
      lessonStreamCompleted === true &&
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
  }, [lessonStreamCompleted]);

  return (
    <div
      className={`${className} flex flex-col items-center gap-4   text-slate-300 px-5 py-3 rounded-lg ring-2 ring-emerald-500 shadow-emerald-500 ${"shadow-md bg-slate-900"}`}
    >
      <AidBlock content={contentStream} />
    </div>
  );
}
