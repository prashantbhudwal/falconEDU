import React from "react";
import { QuestionType, QuestionItem } from "@/types";
import { currentQuestionAtom } from "@/app/atoms/worksheet";
import { useAtom } from "jotai";
import { DropTargetMonitor, useDrop } from "react-dnd";
import questionData from "@/app/data/questionMatrix.json";
import BloomBoxes from "./BloomBoxes";
import Section from "@/app/components/Section";
import {
  getQuestionSectionShadow,
  getQuestionSectionBorderColor,
  getQuestionSectionTextColor,
} from "@/app/utils/index";
import Question from "./Question";
const getQuestionTypeTitle = (questionType: QuestionType) => {
  const title = questionData.find(
    (question) => question.type === questionType
  )?.title;
  return title ? title : "";
};
type Props = {
  questions: QuestionItem[];
  type: QuestionType;
  droppable?: boolean;
  className?: string;
  hasBloom?: boolean;
};

const Questions: React.FC<Props> = ({
  questions,
  type,
  droppable = false,
  className,
  hasBloom,
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
        ref={droppable ? drop : null}
        className={`text-neutral-300 ${className} ${
          isOver ? "bg-fuchsia-500" : "bg-slate-800"
        } `}
      >
        {questions.length === 0 && (
          <div
            className={`flex flex-col gap-1 pt-2 px-4 ${className} ${
              isOver ? "bg-fuchsia-500 rounded-lg" : ""
            }`}
          >
            Drop a Question here
          </div>
        )}
        {questions.map((question, index) => (
          <div
            key={index}
            className={`flex flex-col gap-1 pt-2 px-4 ${className} ${
              isOver ? "bg-fuchsia-500 rounded-lg" : ""
            }`}
          >
            <Question key={index} index={index + 1} question={question} />
          </div>
        ))}
      </div>
    </Section>
  );
};

export default Questions;
