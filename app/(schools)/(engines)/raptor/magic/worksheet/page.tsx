"use client";
import { useAtom } from "jotai";
import {
  topicAtom,
  boardAtom,
  gradeAtom,
  subjectAtom,
} from "@/lib/atoms/preferences";
import { savedQuestionsAtom } from "@/lib/atoms/worksheet";
import Canvas from "../../components/canvas";
import { QuestionObject } from "@/types";
import QuestionSection from "../../components/question-section";

export default function Page() {
  const [topic] = useAtom(topicAtom);
  const [board] = useAtom(boardAtom);
  const [grade] = useAtom(gradeAtom);
  const [subject] = useAtom(subjectAtom);
  const [savedQuestions] = useAtom(savedQuestionsAtom);
  return (
    <div className="mt-3 flex flex-col gap-3">
      {savedQuestions.map(
        (questionObject: QuestionObject) =>
          questionObject.questions.length > 0 && (
            <QuestionSection
              type={questionObject.type}
              questions={questionObject.questions}
              key={questionObject.type}
              hasDelete={false}
            />
          ),
      )}
    </div>
  );
}
