"use client";
import { useDrag, DragSourceMonitor } from "react-dnd";
import { motion } from "framer-motion";

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
    <motion.div
      ref={dragPreview}
      whileHover={{ cursor: "grab", scale: 1.1 }}
      className={`text-slate-300 px-3 py-2 rounded-md hover:ring-1 hover:ring-emerald-500 ${
        isDragging
          ? "opacity-100 ring-emerald-500 ring-4 bg-emerald-800 border-emerald-500 shadow-lg"
          : "opacity-100 ring-slate-500 ring-1 bg-slate-800 border-slate-500 shadow"
      }`}
    >
      <p
        role={"Handle"}
        ref={drag}
        className={`leading-6 text-lg capitalize text-center`}
      >
        {text}
      </p>
    </motion.div>
  );
}
