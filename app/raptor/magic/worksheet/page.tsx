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
import { getUserData } from "@/app/actions/actions";

export default function Page() {
  const [topic] = useAtom(topicAtom);
  const [board] = useAtom(boardAtom);
  const [grade] = useAtom(gradeAtom);
  const [subject] = useAtom(subjectAtom);
  const [savedQuestions] = useAtom(savedQuestionsAtom);
  const handleLog = async () => {
    const users = await getUserData("prashant.bhudwal@gmail.com");
    console.log(users);
  };
  return (
    <Canvas
      className="col-start-4 col-span-7 min-h-screen gap-4 max-w-4xl"
      color="secondary"
      heading={topic}
      leftTop={`Grade ${grade}`}
      leftBottom={subject}
      rightTop={board}
    >
      <button className="btn-primary" onClick={handleLog}>
        Log users
      </button>
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
    </Canvas>
  );
}
