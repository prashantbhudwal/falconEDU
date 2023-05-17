import React from "react";
import Section from "@/app/components/Section";
import BloomBoxes from "./BloomBoxes";
import questionData from "@/app/data/questionMatrix.json";
import { QuestionType, Question } from "@/types";

const getQuestionTypeTitle = (questionType: QuestionType) => {
  const title = questionData.find(
    (question) => question.type === questionType
  )?.title;
  return title ? title : "";
};

type Props = {
  questionType: QuestionType;
  questions: Question[];
  withBloom?: boolean;
};

const QuestionSection: React.FC<Props> = ({
  questionType,
  questions,
  withBloom = false,
}) => {
  return (
    <Section title={getQuestionTypeTitle(questionType)} key={questionType}>
      {withBloom && <BloomBoxes questionTypeKey={questionType} />}
      {questions.map((question, index) => (
        <div className="flex flex-col gap-1 pt-2 px-4" key={index}>
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
    </Section>
  );
};

export default QuestionSection;
