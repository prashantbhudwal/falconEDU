"use client";
import { useState, useEffect, useCallback } from "react";
import { v4 as uuid } from "uuid";
import useLessonStream from "@/app/hooks/useLessonStream";
import LessonCanvasBlock from "./LessonCanvasBlock";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import {
  contentStreamCompletedAtom,
  lessonToDownloadAtom,
} from "../atoms/lesson";
import { topicAtom, subtopicAtom } from "../atoms/preferences";
import { BlockContent } from "@/types";

export default function Canvas({ className }: { className?: string }) {
  const router = useRouter();
  const [fetchNow, setFetchNow] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [currentBlockId, setCurrentBlockId] = useState<string>("");
  const [lastBlockId, setLastBlockId] = useState<string>("");
  const [lessonStreamCompleted, setLessonStreamCompleted] = useAtom(
    contentStreamCompletedAtom
  );
  const [lessonToDownload, setLessonToDownload] = useAtom(lessonToDownloadAtom);
  const [topic] = useAtom(topicAtom);
  const [subtopic] = useAtom(subtopicAtom);

  const [lessonPlanBlockContent, setLessonPlanBlockContent] = useState<
    BlockContent[]
  >([]);

  useEffect(() => {
    if (topic === "" || subtopic === "") {
      router.push("/preferences");
    }
    setMessages([]);
    setLessonStreamCompleted(false);
    setFetchNow(true);
  }, []);

  const handleNewMessage = useCallback((message: string) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  const { isLoading, error } = useLessonStream(
    handleNewMessage,
    fetchNow,
    () => setFetchNow(false),
    () => setLessonStreamCompleted(true),
    () => setCurrentBlockId(uuid())
  );

  useEffect(() => {
    if (
      lessonStreamCompleted === true &&
      messages.length > 0 &&
      currentBlockId != lastBlockId
    ) {
      const randomId = uuid();
      const emoji = "📝";
      setLessonPlanBlockContent((prevBlockContent) => [
        ...prevBlockContent,
        {
          text: messages,
          id: randomId,
          type: "lessonPlan",
          emoji: emoji,
        },
      ]);
      setLastBlockId(currentBlockId);
      setLessonToDownload(messages);
    }
  }, [lessonStreamCompleted]);

  return (
    <div
      className={`${className} flex flex-col items-center gap-4   text-slate-300 px-5 py-3 rounded-lg ring-2 ring-emerald-500 shadow-emerald-500 ${"shadow-md bg-slate-900"}`}
    >
      {lessonStreamCompleted ? (
        <LessonCanvasBlock text={lessonToDownload} />
      ) : (
        <LessonCanvasBlock text={messages} />
      )}
    </div>
  );
}
