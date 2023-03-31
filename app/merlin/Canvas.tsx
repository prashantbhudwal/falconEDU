"use client";
import { useDrop, DropTargetMonitor } from "react-dnd";
import { useState } from "react";
import CanvasBlock from "./CanvasBlock";
import { blockContentArray } from "../utils";

export default function Canvas({ className }: { className?: string }) {
  const [blockType, setBlockType] = useState<string>("");
  const specObject = {
    accept: "Box",
    drop: (item: string) => setBlockType(item),
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  };
  const [{ canDrop, isOver }, drop] = useDrop(() => specObject);

  return (
    <div
      ref={drop}
      role={"Board"}
      className={`${className} flex flex-col items-center gap-4   text-slate-300 px-5 py-3 rounded-lg ring-2 ring-emerald-500 shadow-emerald-500 shadow-md ${
        isOver
          ? "shadow-inner backdrop-blur-xl bg-emerald-900"
          : "shadow-md bg-slate-900"
      }`}
    >
      <header className="font-medium text-emerald-500 text-center border-b border-solid border-emerald-700 pb-2">
        <p className="uppercase">Canvas</p>
      </header>
      {JSON.stringify(blockType)}
      {blockContentArray.map((block: any) => {
        return <CanvasBlock {...block} key={block.id} />;
      })}
    </div>
  );
}
