"use client";
import { useDrag, DragSourceMonitor } from "react-dnd";

export default function DraggableChip({
  children,
  color = "primary",
  type,
}: {
  type: string;
  children: React.ReactNode;
  color?: "primary" | "secondary" | "info" | "base" | "accent";
}) {
  const specObject = {
    type: type,
    item: { text: children },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  };
  const [{ isDragging }, drag, dragPreview] = useDrag(() => specObject);

  let badgeColor = "";

  switch (color) {
    case "primary":
      badgeColor = "badge-primary";
      break;
    case "secondary":
      badgeColor = "badge-secondary";
      break;
    case "info":
      badgeColor = "badge-info";
      break;
    case "base":
      badgeColor = "badge-base-100";
      break;
    case "accent":
      badgeColor = "badge-accent";
      break;
    default:
      badgeColor = "badge-base-100";
      break;
  }

  return (
    <div ref={dragPreview} className={"w-full rounded-md"}>
      <div
        className={`badge badge-lg h-auto w-full cursor-grab rounded-md bg-base-100 px-4 py-2 text-left text-sm capitalize text-text-300 shadow-sm hover:scale-110 ${
          isDragging ? `${badgeColor}` : ``
        }`}
        ref={drag}
        role={"Handle"}
      >
        <p className="w-full">{children}</p>
      </div>
    </div>
  );
}
