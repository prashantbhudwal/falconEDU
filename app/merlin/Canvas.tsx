"use client";
import { useDrop, DropTargetMonitor } from "react-dnd";
import { useState, useEffect, useCallback } from "react";
import CanvasBlock from "./CanvasBlock";
import useFalconStream from "@/hooks/useFalconStream";
import { useAppState } from "../context/app-context";
import { getEmoji } from "../utils";
import { v4 as uuid } from "uuid";
import LiveBlock from "./LiveBlock";

interface BlockContent {
  text: string | string[];
  id: string;
  type: string;
  emoji: string;
}

export default function Canvas({ className }: { className?: string }) {
  const [fetchNow, setFetchNow] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [blockType, setBlockType] = useState<string>("");
  const [streamCompleted, setStreamCompleted] = useState<boolean>();
  const [currentBlockId, setCurrentBlockId] = useState<string>("");
  const [lastBlockId, setLastBlockId] = useState<string>("");
  const removeBlock = (id: string) => {
    setBlockContent((prevBlockContent) =>
      prevBlockContent.filter((block) => block.id !== id)
    );
  };

  const startGeneration = function (item: any) {
    setMessages([]);
    setBlockType(item.text.toLowerCase());
    setStreamCompleted(false);
    setFetchNow(true);
  };

  const {
    topic,
    subtopic,
    currentLesson: blockContent,
    setCurrentLesson: setBlockContent,
  } = useAppState();
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
      setBlockContent((prevBlockContent) => [
        ...prevBlockContent,
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
      ref={drop}
      role={"Board"}
      className={`${className} flex flex-col items-center gap-4   text-slate-300 px-5 py-3 rounded-lg ring-2 ring-emerald-500 shadow-emerald-500 ${
        isOver ? "shadow-inner bg-emerald-900" : "shadow-md bg-slate-900"
      }`}
    >
      <header className="font-medium text-emerald-500 text-center border-b border-solid border-emerald-700 pb-2">
        <h1 className="text-xl">{subtopic}</h1>
        <p className=" text-base  text-slate-600">Chapter: {topic}</p>
      </header>
      {!blockType && (
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
      {blockContent
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
