import { db } from "@/app/dragon/teacher/routers";
import { Suspense } from "react";
import {
  QuestionText,
  Options,
  Option,
  Answer,
  StudentResponse,
  Hint,
  Question,
} from "../question/question";
import prisma from "@/prisma";

export async function QuestionList({ attemptId }: { attemptId: string }) {
  const questions = await db.parseQuestionRouter.getParsedQuestionsByBotChatId({
    botChatId: attemptId,
  });
  if (!questions) return null;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-full space-y-3">
        {questions.map((question) => (
          <Question isCorrect={question.isCorrect} key={question.id}>
            <QuestionText questionNumber={question.question_number}>
              {question.question}
            </QuestionText>
            {question.options && question.options?.length > 0 && (
              <Options>
                {question.options.map((option) => (
                  <Option key={option}>{option}</Option>
                ))}
              </Options>
            )}
            <StudentResponse>{question.student_answer}</StudentResponse>
            <Answer>{question.correct_answer}</Answer>
            {question.hint && <Hint>{question.hint}</Hint>}
          </Question>
        ))}
      </div>
    </Suspense>
  );
}
