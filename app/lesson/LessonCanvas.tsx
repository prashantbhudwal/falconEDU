"use client";
import { useState, useEffect, useCallback } from "react";
import { useAppState } from "../context/app-context";
import { v4 as uuid } from "uuid";
import useLessonStream from "@/hooks/useLessonStream";
import LessonCanvasBlock from "./LessonCanvasBlock";
import Issue from "./Issue";

interface BlockContent {
  text: string | string[];
  id: string;
  type: string;
  emoji: string;
}

export default function Canvas({ className }: { className?: string }) {
  const [fetchNow, setFetchNow] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [streamCompleted, setStreamCompleted] = useState<boolean>();
  const [currentBlockId, setCurrentBlockId] = useState<string>("");
  const [lastBlockId, setLastBlockId] = useState<string>("");
  const [showNote, setShowNote] = useState(false);

  const [lessonPlanBlockContent, setLessonPlanBlockContent] = useState<
    BlockContent[]
  >([]);

  useEffect(() => {
    setMessages([]);
    setStreamCompleted(false);
    setFetchNow(true);
  }, []);

  const { topic, subtopic, currentLesson: blockContent } = useAppState();

  const handleNewMessage = useCallback((message: string) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  const { isLoading, error } = useLessonStream(
    handleNewMessage,
    fetchNow,
    () => setFetchNow(false),
    () => setStreamCompleted(true),
    () => setCurrentBlockId(uuid())
  );

  useEffect(() => {
    if (
      streamCompleted === true &&
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
    }
  }, [streamCompleted]);

  return (
    <div
      className={`${className} flex flex-col items-center gap-4   text-slate-300 px-5 py-3 rounded-lg ring-2 ring-emerald-500 shadow-emerald-500 ${"shadow-md bg-slate-900"}`}
    >
      {streamCompleted && (
        <p
          className="text-gray-600 cursor-pointer hover:underline ml-auto text-sm"
          onMouseEnter={() => setShowNote(true)}
          onMouseLeave={() => setShowNote(false)}
        >
          Incomplete lesson?
        </p>
      )}
      {showNote && <Issue />}
      <LessonCanvasBlock text={messages} />
    </div>
  );
}
