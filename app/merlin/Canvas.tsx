"use client";
import { useDrop, DropTargetMonitor } from "react-dnd";
import { useState, useEffect, useCallback } from "react";
import CanvasBlock from "./CanvasBlock";
import { blockContentArray } from "../utils";
import useFalconStream from "@/hooks/useOpenAIStream";

export default function Canvas({ className }: { className?: string }) {
  const [messages, setMessages] = useState<string[]>([]);
  const [blockType, setBlockType] = useState<string>("");
  const specObject = {
    accept: "Box",
    drop: (item) => setBlockType(item.text), //TODO fix the block type item.text?
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  };
  console.log(blockType);
  const [{ isOver }, drop] = useDrop(() => specObject);

  const handleNewMessage = useCallback((message: string) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []); // and what is happening here?

  const { isLoading, error } = useFalconStream(
    "Can you write a note on JayZ",
    handleNewMessage
  ); //What is this even doing?

  useEffect(() => {
    if (blockType) {
      setMessages([]);
    }
  }, [blockType]);

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
      <CanvasBlock text={messages} emoji={"🥸"} type={blockType} key={"test"} />
      {blockContentArray.map((block: any) => {
        return <CanvasBlock {...block} key={block.id} />;
      })}
    </div>
  );
}
