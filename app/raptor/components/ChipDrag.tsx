"use client";
import { useDrag, DragSourceMonitor } from "react-dnd";
import { motion } from "framer-motion";

export default function ChipDrag({
  children,
  color = "primary",
}: {
  children: React.ReactNode;
  color?: "primary" | "secondary" | "gray";
}) {
  const specObject = {
    type: "topic",
    item: { text: children },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  };
  const [{ isDragging }, drag, dragPreview] = useDrag(() => specObject);

  let ringColorClass = "";
  let bgClass = "";
  let borderClass = "";
  let shadowClass = "";

  if (color === "primary") {
    ringColorClass = "ring-emerald-800";
    bgClass = "bg-emerald-800";
    borderClass = "border-emerald-800";
    shadowClass = "shadow-lg";
  } else if (color === "secondary") {
    ringColorClass = "ring-fuchsia-800";
    bgClass = "bg-fuchsia-800";
    borderClass = "border-fuchsia-800";
    shadowClass = "shadow-lg";
  } else if (color === "gray") {
    ringColorClass = "ring-slate-800";
    bgClass = "bg-slate-800";
    borderClass = "border-slate-800";
    shadowClass = "shadow";
  }

  return (
    <motion.div
      ref={dragPreview}
      whileHover={{ cursor: "grab", scale: 1.1 }}
      className={`text-slate-300  px-3 py-2 rounded-md ring-1 hover:${bgClass} hover:${borderClass} hover:${shadowClass} ${
        isDragging
          ? `opacity-100 ${ringColorClass} ring-4 ${bgClass} ${borderClass} ${shadowClass}`
          : "opacity-100 bg-slate-800 ring-slate-700 border-slate-500 text-slate-200"
      }`}
    >
      <p
        role={"Handle"}
        ref={drag}
        className={`leading-6 capitalize text-left`}
      >
        {children}
      </p>
    </motion.div>
  );
}
