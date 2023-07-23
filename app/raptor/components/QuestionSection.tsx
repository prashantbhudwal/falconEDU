import React, { useState } from "react";
import { QuestionType, QuestionItem } from "@/types";
import { currentQuestionAtom, isAdvancedModeAtom } from "@/app/atoms/worksheet";
import { useAtom } from "jotai";
import { DropTargetMonitor, useDrop } from "react-dnd";
import questionData from "@/app/data/questionMatrix.json";
import BloomBoxes from "./BloomBoxes";
import Section from "@/components/Section";
import {
  getQuestionSectionShadow,
  getQuestionSectionBorderColor,
  getQuestionSectionTextColor,
} from "@/utils/index";
import Question from "./Question";
import { getQuestionTypeTitle } from "@/utils/index";
import { contentStreamCompletedAtom } from "@/app/atoms/lesson";
type Props = {
  questions: QuestionItem[];
  type: QuestionType;
  droppable?: boolean;
  className?: string;
  hasBloom?: boolean;
  handleQuestionClick?: (question: QuestionItem) => void;
  hasDelete?: boolean;
};

const Questions: React.FC<Props> = ({
  questions,
  type,
  droppable = false,
  className,
  hasBloom,
  hasDelete = true,
  handleQuestionClick = () => {},
}) => {
  const [_, setCurrentQuestion] = useAtom(currentQuestionAtom);
  const [isAdvancedMode] = useAtom(isAdvancedModeAtom);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [lastIndex, setLastIndex] = useState<number | null>(null);
  const [contentStreamCompleted] = useAtom(contentStreamCompletedAtom);
  const handleDrop = (item: any) => {
    setCurrentQuestion({
      type: type,
      bloomLevel: "Remember",
      subtopic: item.text,
    });
    setHoverIndex(null);
  };
  const specObject = {
    accept: "topic",
    drop: (item: any) => handleDrop(item),
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  };
  const [{ isOver, canDrop }, drop] = useDrop(() => specObject);
  return (
    <Section
      title={getQuestionTypeTitle(type)}
      key={type}
      color="secondaryGray"
      headingColor={getQuestionSectionTextColor(type)}
      dividerColor={getQuestionSectionBorderColor(type)}
      className={`w-full px-5 py-3 rounded-lg shadow-sm ${getQuestionSectionShadow(
        type
      )}`}
    >
      {hasBloom && <BloomBoxes questionTypeKey={type} />}

      <div
        ref={contentStreamCompleted && droppable ? drop : null}
        className={`text-neutral-300 ${className} ${
          isOver ? "bg-fuchsia-500" : "bg-slate-800"
        } `}
      >
        {questions.length === 0 && !isAdvancedMode && (
          <div
            className={`flex text-slate-500 text-center flex-col gap-1 pt-2 px-4 ${className} ${
              isOver ? "bg-fuchsia-500 rounded-lg" : ""
            }`}
          >
            Drop a topic here
          </div>
        )}
        {questions.map((question, index) => (
          <div
            onMouseEnter={() => {
              setHoverIndex(index);
              setLastIndex(index);
            }}
            onMouseLeave={() => {
              setHoverIndex(null);
              setLastIndex(null);
            }}
            key={index}
            className={`relative flex flex-col gap-1 pt-2 px-4 ${className} ${
              isOver ? "bg-fuchsia-500 rounded-lg" : ""
            }`}
          >
            <Question
              key={question.questionId}
              index={index + 1}
              question={question}
              onClick={() => handleQuestionClick(question)}
            />
            {hasDelete && hoverIndex === index && (
              <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 rounded-md flex items-center justify-center text-white text-lg pointer-events-none">
                ❌
              </div>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
};

export default Questions;
