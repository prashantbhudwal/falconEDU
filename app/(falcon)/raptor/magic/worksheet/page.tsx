"use client";
import { useAtom } from "jotai";
import {
  topicAtom,
  boardAtom,
  gradeAtom,
  subjectAtom,
} from "@/atoms/preferences";
import { savedQuestionsAtom } from "@/atoms/worksheet";
import Canvas from "../../components/Canvas";
import { QuestionObject } from "@/types";
import QuestionSection from "../../components/QuestionSection";
import { createWorksheet } from "@/(archive)/actions/actions";

export default function Page() {
  const [topic] = useAtom(topicAtom);
  const [board] = useAtom(boardAtom);
  const [grade] = useAtom(gradeAtom);
  const [subject] = useAtom(subjectAtom);
  const [savedQuestions] = useAtom(savedQuestionsAtom);
  return (
    <div>
      {savedQuestions.map(
        (questionObject: QuestionObject) =>
          questionObject.questions.length > 0 && (
            <QuestionSection
              type={questionObject.type}
              questions={questionObject.questions}
              key={questionObject.type}
              hasDelete={false}
            />
          )
      )}
    </div>
  );
}
