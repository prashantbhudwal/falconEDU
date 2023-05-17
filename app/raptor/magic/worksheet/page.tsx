"use client";
import { useAtom } from "jotai";
import { lessonIdeasAtom } from "@/app/atoms/lesson";
import ideasToHandouts from "@/app/utils/ideasToHandouts";
import {
  topicAtom,
  subtopicAtom,
  boardAtom,
  gradeAtom,
  subjectAtom,
} from "@/app/atoms/preferences";
import Header from "@/app/components/Header";
import { savedQuestionsAtom } from "@/app/atoms/worksheet";
import Canvas from "../../components/Canvas";
import { QuestionType, Questions } from "@/types";
import QuestionSection from "../../components/QuestionSection";

export default function Page() {
  const [topic] = useAtom(topicAtom);
  const [subtopic] = useAtom(subtopicAtom);
  const [board] = useAtom(boardAtom);
  const [grade] = useAtom(gradeAtom);
  const [subject] = useAtom(subjectAtom);
  const [savedQuestions] = useAtom(savedQuestionsAtom);
  function isKeyOfQuestions(key: string): key is keyof Questions {
    return key in savedQuestions;
  }
  return (
    <Canvas
      className="col-start-4 col-span-7 min-h-screen"
      color="secondary"
      heading={topic}
      leftTop={`Grade ${grade}`}
      leftBottom={subject}
      rightTop={board}
    >
      {Object.keys(savedQuestions).map((questionType) => {
        const questionTypeKey = questionType as QuestionType;
        if (isKeyOfQuestions(questionTypeKey)) {
          return (
            <QuestionSection
              questionTypeKey={questionTypeKey}
              savedQuestions={savedQuestions}
              key={questionTypeKey}
            />
          );
        }
      })}
    </Canvas>
  );
}
