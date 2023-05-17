import React from "react";
import { QuestionType, Question } from "@/types";
import { currentQuestionAtom } from "@/app/atoms/worksheet";
import { useAtom } from "jotai";
import { DropTargetMonitor, useDrop } from "react-dnd";

type Props = {
  questions: Question[];
  type: QuestionType;
  droppable: boolean;
};

const Questions: React.FC<Props> = ({ questions, type, droppable = false }) => {
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
    <div>
      {questions.map((question, index) => (
        <div
          className={`flex flex-col gap-1 pt-2 px-4 ${
            isOver ? "bg-fuchsia-500" : ""
          }`}
          key={index}
          ref={droppable ? drop : null}
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
