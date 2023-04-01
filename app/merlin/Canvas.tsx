"use client";
import { useDrop, DropTargetMonitor } from "react-dnd";
import { useState, useEffect, useCallback, useRef } from "react";
import CanvasBlock from "./CanvasBlock";
import useFalconStream from "@/hooks/useOpenAIStream";
import { useAppState } from "../context/app-context";
import { getEmoji } from "../utils";
import { v4 as uuid } from "uuid";

interface BlockContent {
  text: string | string[];
  id: string;
  type: string;
  emoji: string;
}

export default function Canvas({ className }: { className?: string }) {
  const prevIsLoadingRef = useRef<boolean>();
  const [fetchNow, setFetchNow] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [blockType, setBlockType] = useState<string>("");
  const [blockContent, setBlockContent] = useState<BlockContent[]>([]);
  const [lastBlockId, setLastBlockId] = useState("");
  const {
    topic: chatTopic,
    subtopic: chatSubtopic,
    grade: chatGrade,
  } = useAppState();

  const specObject = {
    accept: "Box",
    drop: (item) => setBlockType(item.text.toLowerCase()),
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  };

  const [{ isOver }, drop] = useDrop(() => specObject);

  const handleNewMessage = useCallback((message: string) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  const { isLoading, error } = useFalconStream(
    `Can you ${blockType} the topic ${chatSubtopic} from the chapter ${chatTopic} of grade ${chatGrade} NCERT Textbook.`,
    handleNewMessage,
    fetchNow,
    () => setFetchNow(false)
  );

  useEffect(() => {
    if (blockType) {
      setMessages([]);
      setFetchNow(true);
    }
  }, [blockType]);

  useEffect(() => {
    prevIsLoadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    if (isLoading === false && messages.length > 0) {
      const randomId = uuid();
      setBlockContent((prevBlockContent) => [
        ...prevBlockContent,
        {
          text: messages,
          id: randomId,
          type: blockType,
          emoji: getEmoji(blockType),
        },
      ]);
      setLastBlockId(randomId);
    }
  }, [isLoading, blockType]);
  return (
    <div
      ref={drop}
      role={"Board"}
      className={`${className} flex flex-col items-center gap-4   text-slate-300 px-5 py-3 rounded-lg ring-2 ring-emerald-500 shadow-emerald-500 ${
        isOver ? "shadow-inner bg-emerald-900" : "shadow-md bg-slate-900"
      }`}
    >
      <header className="font-medium text-emerald-500 text-center border-b border-solid border-emerald-700 pb-2">
        <p className="uppercase">Canvas</p>
      </header>
      {blockType && (
        <CanvasBlock
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
