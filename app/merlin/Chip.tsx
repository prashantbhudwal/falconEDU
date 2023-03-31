"use client";
import { useDrag, DragSourceMonitor } from "react-dnd";

export default function Chip({ text }: { text: string }) {
  const specObject = {
    type: "Box",
    item: { text },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  };
  const [{ isDragging }, drag, dragPreview] = useDrag(() => specObject);
  return (
    <div
      ref={dragPreview}
      className={` text-slate-300 px-3 py-3 rounded-xl ${
        isDragging
          ? "opacity-100 ring-emerald-500 ring-4 bg-emerald-800 "
          : "opacity-100 ring-slate-500 ring-1 bg-slate-800"
      }`}
    >
      <p
        role={"Handle"}
        ref={drag}
        className={`leading-6 text-lg uppercase text-center `}
      >
        {text}
      </p>
    </div>
  );
}
