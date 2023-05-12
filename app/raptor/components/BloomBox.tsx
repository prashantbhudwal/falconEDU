import { useDrop, DropTargetMonitor } from "react-dnd";
import { useAtom } from "jotai";
import { currentQuestionAtom } from "../../atoms/worksheet";
import { QuestionType } from "@/types";

export default function BoxDrop({
  children,
  className,
  questionType,
  bloomLevel,
}: React.PropsWithChildren<{
  className?: string;
  questionType: QuestionType;
  bloomLevel: string;
}>) {
  const [currentQuestion, setCurrentQuestion] = useAtom(currentQuestionAtom);
  const specObject = {
    accept: "topic",
    drop: (item: any) =>
      setCurrentQuestion({
        questionType: questionType,
        bloomLevel: bloomLevel,
        subtopic: item.text,
      }),
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  };

  const [{ isOver, canDrop }, drop] = useDrop(() => specObject);

  return (
    <div
      className={`${className} text-center text-sm pb-2 ${
        isOver ? "bg-fuchsia-500 scale-150 rounded-md" : ""
      }`}
    >
      <div ref={drop}>{children}</div>
    </div>
  );
}
