"use client";
import { useDrop, DropTargetMonitor } from "react-dnd";
import { useState, useEffect, useCallback } from "react";
import CanvasBlock from "./components/CanvasBlock";
import useFalconStream from "@/app/hooks/useFalconStream";
import { getEmoji } from "../utils";
import { v4 as uuid } from "uuid";
import LiveBlock from "./components/LiveBlock";
import { useRouter } from "next/navigation";
import { BlockContent } from "@/types";
import {
  topicAtom,
  subtopicAtom,
  gradeAtom,
  boardAtom,
  subjectAtom,
} from "../atoms/preferences";
import { useAtom } from "jotai";
import { lessonIdeasAtom } from "../atoms/lesson";

export default function Canvas({ className }: { className?: string }) {
  const router = useRouter();
  const [fetchNow, setFetchNow] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [blockType, setBlockType] = useState<string>("");
  const [streamCompleted, setStreamCompleted] = useState<boolean>(true);
  const [currentBlockId, setCurrentBlockId] = useState<string>("");
  const [lastBlockId, setLastBlockId] = useState<string>("");
  const [topic] = useAtom(topicAtom);
  const [subtopic] = useAtom(subtopicAtom);
  const [grade] = useAtom(gradeAtom);
  const [board] = useAtom(boardAtom);
  const [subject] = useAtom(subjectAtom);
  const [lessonIdeas, setLessonIdeas] = useAtom(lessonIdeasAtom);

  const removeBlock = (id: string) => {
    setLessonIdeas((prevIdeas) => prevIdeas.filter((idea) => idea.id !== id));
  };

  const startGeneration = function (item: any) {
    setMessages([]);
    setBlockType(item.text.toLowerCase());
    setStreamCompleted(false);
    setFetchNow(true);
  };

  if (topic === "" || subtopic === "") {
    router.push("/preferences");
  }

  const specObject = {
    accept: "Box",
    drop: (item: any) => startGeneration(item),
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  };

  const [{ isOver, canDrop }, drop] = useDrop(() => specObject);

  const handleNewMessage = useCallback((message: string) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  const { isLoading, error } = useFalconStream(
    handleNewMessage,
    fetchNow,
    () => setFetchNow(false),
    () => setStreamCompleted(true),
    () => setCurrentBlockId(uuid()),
    blockType
  );

  useEffect(() => {
    if (
      streamCompleted === true &&
      messages.length > 0 &&
      currentBlockId != lastBlockId
    ) {
      const randomId = uuid();
      const emoji = getEmoji(blockType);
      setLessonIdeas((prevIdeas) => [
        ...prevIdeas,
        {
          text: messages,
          id: randomId,
          type: blockType,
          emoji: emoji,
        },
      ]);
      setLastBlockId(currentBlockId);
    }
  }, [streamCompleted]);

  return (
    <div
      ref={streamCompleted ? drop : null}
      role={"Board"}
      className={`${className} flex flex-col items-center gap-4   text-slate-300 px-5 py-3 rounded-lg ring-2 ring-emerald-500 shadow-emerald-500 ${
        isOver ? "shadow-inner bg-emerald-900" : "shadow-md bg-slate-900"
      }`}
    >
      <header className="font-medium text-emerald-500 border-b border-solid border-emerald-700 pb-2 flex flex-row justify-between w-full items-center">
        <div className="text-sm text-left text-emerald-600">
          {`Grade ${grade}`}
          <p>{subject}</p>
        </div>
        <div className="text-center">
          <h1 className="text-3xl">{subtopic}</h1>
          <p className=" text-lg  text-slate-600">{topic}</p>
        </div>
        <div className="text-sm text-left text-emerald-600">{board}</div>
      </header>
      {!blockType && lessonIdeas.length === 0 && (
        <div className="text-emerald-900 text-center text-4xl pt-24">
          <p>Drop a Lesson Block Here</p>
        </div>
      )}
      {streamCompleted === false && (
        <LiveBlock
          text={messages}
          emoji={getEmoji(blockType)}
          type={blockType}
          key={"test"}
        />
      )}
      {lessonIdeas
        .slice()
        .reverse()
        .map((block: BlockContent) => {
          return (
            <CanvasBlock {...block} key={block.id} onRemove={removeBlock} />
          );
        })}
    </div>
  );
}
