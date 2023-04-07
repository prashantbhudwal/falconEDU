"use client";
import { useDrop, DropTargetMonitor } from "react-dnd";
import { useState, useEffect, useCallback } from "react";
import CanvasBlock from "../merlin/CanvasBlock";
import useFalconStream from "@/hooks/useFalconStream";
import { useAppState } from "../context/app-context";
import { getEmoji } from "../utils";
import { v4 as uuid } from "uuid";
import LiveBlock from "../merlin/LiveBlock";
import useLessonStream from "@/hooks/useLessonStream";
import LessonCanvasBlock from "./LessonCanvasBlock";

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
      <header className="font-medium text-emerald-500 text-center border-b border-solid border-emerald-700 pb-2">
        <h1 className="text-xl">{subtopic}</h1>
        <p className=" text-base  text-slate-400">Chapter: {topic}</p>
      </header>
      <LessonCanvasBlock text={messages} />
    </div>
  );
}
