"use client";
import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import AidBlock from "./AidBlock";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import {
  lessonStreamCompletedAtom,
  lessonToDownloadAtom,
  contentStreamAtom,
  teachingAidsAtom,
  currentLessonAtom,
} from "@/app/atoms/lesson";
import { topicAtom, subtopicAtom, gradeAtom } from "@/app/atoms/preferences";
import { BlockContent } from "@/types";
import fetchContentStream from "@/app/utils/fetchContentStream";

export default function Aid({ className }: { className?: string }) {
  const router = useRouter();
  const [currentBlockId, setCurrentBlockId] = useState<string>("");
  const [lastBlockId, setLastBlockId] = useState<string>("");
  const [contentStream, setContentStream] = useAtom(contentStreamAtom);
  const [teachingAids, setTeachingAids] = useAtom(teachingAidsAtom);
  const [lessonStreamCompleted, setLessonStreamCompleted] = useAtom(
    lessonStreamCompletedAtom
  );
  const [currentLesson] = useAtom(currentLessonAtom);
  const [lessonToDownload, setLessonToDownload] = useAtom(lessonToDownloadAtom);
  const [topic] = useAtom(topicAtom);
  const [subtopic] = useAtom(subtopicAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [grade] = useAtom(gradeAtom);

  useEffect(() => {
    if (topic === "" || subtopic === "") {
      router.push("/preferences");
    }
    setContentStream([]);
    setLessonStreamCompleted(false);

    const fetchData = async () => {
      setIsLoading(true);
      try {
        await fetchContentStream(
          (message: string) => {
            setContentStream((prevContent) => [...prevContent, message]);
          },
          { topic, subtopic, grade, ideaArray: currentLesson },
          () => setLessonStreamCompleted(true),
          () => setCurrentBlockId(uuid())
        );
      } catch (error) {
        setError("Error reading stream");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [subtopic]);

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
