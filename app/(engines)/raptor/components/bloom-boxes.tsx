import { QuestionType } from "@/types";
import React from "react";
import BloomBox from "./bloom-box";

type Props = {
  questionTypeKey: QuestionType;
};

const levels = [
  "Remember",
  "Understand",
  "Apply",
  "Analyze",
  "Evaluate",
  "Create",
];

const BloomBoxes: React.FC<Props> = ({ questionTypeKey }) => {
  return (
    <div className="grid grid-cols-6 divide-x divide-slate-800 text-text-400">
      {levels.map((level, index) => (
        <BloomBox key={index} type={questionTypeKey} bloomLevel={level}>
          {level}
        </BloomBox>
      ))}
    </div>
  );
};

export default BloomBoxes;
