"use client";
import { useAtom } from "jotai";
import {
  topicAtom,
  boardAtom,
  gradeAtom,
  subjectAtom,
} from "@/app/atoms/preferences";
import { savedQuestionsAtom } from "@/app/atoms/worksheet";
import Canvas from "../../components/Canvas";
import { QuestionObject } from "@/types";
import QuestionSection from "../../components/QuestionSection";

export default function Page() {
  const [topic] = useAtom(topicAtom);
  const [board] = useAtom(boardAtom);
  const [grade] = useAtom(gradeAtom);
  const [subject] = useAtom(subjectAtom);
  const [savedQuestions] = useAtom(savedQuestionsAtom);
  return (
    <Canvas
      className="col-start-4 col-span-7 min-h-screen"
      color="secondary"
      heading={topic}
      leftTop={`Grade ${grade}`}
      leftBottom={subject}
      rightTop={board}
    >
      {savedQuestions.map((questionObject: QuestionObject) => (
        <QuestionSection
          type={questionObject.type}
          questions={questionObject.questions}
          key={questionObject.type}
        />
      ))}
    </Canvas>
  );
}
