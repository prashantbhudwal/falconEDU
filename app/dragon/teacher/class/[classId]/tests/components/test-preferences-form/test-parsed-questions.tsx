import { db } from "@/app/dragon/teacher/routers";
import { typeGetParsedQuestionByBotConfigId } from "@/app/dragon/teacher/routers/parsedQuestionRouter";
import { useState } from "react";
import { QuestionForm } from "./question-form";

export function TestParsedQuestion({
  parsedQuestions,
}: {
  parsedQuestions: typeGetParsedQuestionByBotConfigId;
}) {
  return (
    <>
      {parsedQuestions && parsedQuestions.length > 0 && (
        <>
          {parsedQuestions.map((question, i) => {
            return (
              <QuestionForm
                key={question.id}
                question={question}
                className="mt-10"
              />
            );
          })}
        </>
      )}
    </>
  );
}
