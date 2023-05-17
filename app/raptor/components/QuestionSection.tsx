import React from "react";
import Section from "@/app/components/Section";
import BloomBoxes from "./BloomBoxes";
import questionData from "@/app/data/questionMatrix.json";
import { QuestionType, Questions } from "@/types";

const getQuestionTypeTitle = (questionType: QuestionType) => {
  const title = questionData.find(
    (question) => question.type === questionType
  )?.title;
  return title ? title : "";
};

type Props = {
  questionTypeKey: QuestionType;
  savedQuestions: Questions;
  withBloom?: boolean;
};

const QuestionSection: React.FC<Props> = ({
  questionTypeKey,
  savedQuestions,
  withBloom = false,
}) => {
  return (
    <Section
      title={getQuestionTypeTitle(questionTypeKey)}
      key={questionTypeKey}
    >
      {withBloom && <BloomBoxes questionTypeKey={questionTypeKey} />}
      {savedQuestions[questionTypeKey]?.map((question, index) => (
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
