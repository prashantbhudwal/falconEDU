"use client";
import { useState, useEffect, useCallback } from "react";
import CanvasBlock from "@/app/merlin/CanvasBlock";
import useFalconStream from "@/hooks/useFalconStream";
import { useAppState } from "../context/app-context";
import { getEmoji } from "../utils";
import { v4 as uuid } from "uuid";
import LiveBlock from "@/app/merlin/LiveBlock";

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
  const [blockContent, setBlockContent] = useState<BlockContent[]>([]);
  const { topic, subtopic, grade, setCurrentLesson } = useAppState();

  const handleNewMessage = useCallback((message: string) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  const { isLoading, error } = useFalconStream(
    handleNewMessage,
    fetchNow,
    () => setFetchNow(false),
    blockType
  );

  useEffect(() => {
    if (blockType) {
      setMessages([]);
      setFetchNow(true);
    }
  }, [blockType]);

  useEffect(() => {
    if (isLoading === false && messages.length > 0) {
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
    }
  }, [isLoading, blockType]);
  return (
    <div
      className={`${className} flex flex-col items-center gap-4   text-slate-300 px-5 py-3 rounded-lg ring-2 ring-emerald-500 shadow-emerald-500 shadow-md bg-slate-900"
      }`}
    >
      <header className="font-medium text-emerald-500 text-center border-b border-solid border-emerald-700 pb-2">
        <h1 className="text-xl">{subtopic}</h1>
        <p className=" text-base  text-slate-600">Chapter: {topic}</p>
      </header>

      {blockType && (
        <LiveBlock
          text={messages}
          emoji={getEmoji(blockType)}
          type={blockType}
          key={"test"}
        />
      )}
      {blockContent.map((block: any) => {
        return <CanvasBlock {...block} key={block.id} />;
      })}
    </div>
  );
}
