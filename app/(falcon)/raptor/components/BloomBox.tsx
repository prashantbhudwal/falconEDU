import { useDrop, DropTargetMonitor } from "react-dnd";
import { useAtom } from "jotai";
import { currentQuestionAtom } from "../../../../atoms/worksheet";
import { QuestionType } from "@/types";
import questionData from "../../../data/questionMatrix.json";
import { useState, useEffect } from "react";
import { contentStreamCompletedAtom } from "@/atoms/lesson";
function getBloomLevel(bloomLevel: string | undefined): string {
  const lowerCaseBloomLevel = bloomLevel?.toLowerCase();
  switch (lowerCaseBloomLevel) {
    case "remember":
      return "Remembering";
    case "understand":
      return "Understanding";
    case "apply":
      return "Applying";
    case "analyze":
      return "Analyzing";
    case "evaluate":
      return "Evaluating";
    case "create":
      return "Creating";
    default:
      throw new Error("Invalid bloom level");
  }
}

export default function BoxDrop({
  children,
  className,
  type,
  bloomLevel,
}: React.PropsWithChildren<{
  className?: string;
  type: QuestionType;
  bloomLevel: string;
}>) {
  const [contentStreamCompleted] = useAtom(contentStreamCompletedAtom);
  const [currentQuestion, setCurrentQuestion] = useAtom(currentQuestionAtom);
  const [inactive, setInactive] = useState(false);
  const specObject = {
    accept: "topic",
    drop: (item: any) =>
      setCurrentQuestion({
        type: type,
        bloomLevel: bloomLevel,
        subtopic: item.text,
      }),
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  };
  const applicableBloomLevels = questionData.find(
    (question) => question.type === type
  )?.bloomLevels;

  const fullBloomLevel = getBloomLevel(bloomLevel);
  const [{ isOver, canDrop }, drop] = useDrop(() => specObject);

  useEffect(() => {
    if (!applicableBloomLevels?.includes(fullBloomLevel.toLowerCase())) {
      setInactive(true);
    }
  }, []);
  return (
    <div
      className={`${className} text-center text-sm pb-2 ${
        isOver ? "bg-fuchsia-500 scale-150 rounded-md" : ""
      } ${inactive ? "opacity-30" : ""}`}
    >
      <div ref={!inactive && contentStreamCompleted ? drop : null}>
        {children}
      </div>
    </div>
  );
}
