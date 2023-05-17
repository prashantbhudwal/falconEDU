import React from "react";
import { QuestionType, Question } from "@/types";
import { currentQuestionAtom } from "@/app/atoms/worksheet";
import { useAtom } from "jotai";
import { DropTargetMonitor, useDrop } from "react-dnd";

type Props = {
  questions: Question[];
  type: QuestionType;
  droppable?: boolean;
  className?: string;
};

const Questions: React.FC<Props> = ({
  questions,
  type,
  droppable = false,
  className,
}) => {
  const [_, setCurrentQuestion] = useAtom(currentQuestionAtom);

  const specObject = {
    accept: "topic",
    drop: (item: any) =>
      setCurrentQuestion({
        type: type,
        bloomLevel: "Remember",
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
      ref={droppable ? drop : null}
      className={`text-neutral-300 ${className} ${
        isOver ? "bg-fuchsia-500" : "bg-slate-800"
      } `}
    >
      {questions.length === 0 && (
        <div
          className={`flex flex-col gap-1 pt-2 px-4 ${className} ${
            isOver ? "bg-fuchsia-500" : ""
          }`}
        >
          Drop a Question here
        </div>
      )}
      {questions.map((question, index) => (
        <div
          key={index}
          className={`flex flex-col gap-1 pt-2 px-4 ${className} ${
            isOver ? "bg-fuchsia-500" : ""
          }`}
        >
          <div className="">
            {index + 1}. {question.question}
            <div className="pt-2">
              {"options" in question &&
                Array.isArray(question.options) && // type guard
                question.options.map((option: string, optIndex: number) => (
                  <div key={optIndex} className="flex flex-row gap-2">
                    <div>{option}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Questions;
