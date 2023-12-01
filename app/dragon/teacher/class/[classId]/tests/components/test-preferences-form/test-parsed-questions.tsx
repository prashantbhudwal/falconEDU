"use client";
import { typeGetParsedQuestionByBotConfigId } from "@/app/dragon/teacher/routers/parsedQuestionRouter";
import { QuestionForm } from "./question-form";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { parsedQuestionsSchema } from "@/app/dragon/schema";
import { AddQuestionForm } from "./add-question-form";

export function TestParsedQuestion({
  parsedQuestions,
  botId,
  classId,
}: {
  parsedQuestions: typeGetParsedQuestionByBotConfigId;
  botId: string;
  classId: string;
}) {
  const [addedQuestions, setAddedQuestions] = useState<
    NonNullable<typeGetParsedQuestionByBotConfigId> | []
  >([]);

  const addQuestionHandler = () => {
    setAddedQuestions((prev) => [
      ...prev,
      {
        id: `${prev.length + 1}`,
        botConfigId: botId,
        question_type: "OBJECTIVE_MULTIPLE_CHOICE_SINGLE_ANSWER",
        question: "",
        hint: null,
        question_number: prev.length + 1,
        options: [],
        correct_answer: [],
        sample_answer: null,
        max_score: null,
        isArchived: false,
      },
    ]);
  };

  const deleteAddQuestion = ({ id }: { id: string }) => {
    const filteredQuestions = addedQuestions.filter(
      (question) => question.id !== id
    );
    setAddedQuestions(filteredQuestions);
  };

  return (
    <div className="flex flex-col space-y-3">
      {parsedQuestions &&
        parsedQuestions.length > 0 &&
        parsedQuestions.map((question, index) => (
          <QuestionForm
            key={question.id}
            question={question}
            questionNumber={index + 1}
          />
        ))}
      {addedQuestions &&
        addedQuestions.length > 0 &&
        addedQuestions.map((question, index) => {
          return (
            <AddQuestionForm
              key={question.id}
              botConfigId={botId}
              classId={classId}
              question={question}
              questionNumber={
                parsedQuestions ? parsedQuestions.length + index + 1 : index + 1
              }
              deleteQuestions={deleteAddQuestion}
            />
          );
        })}
      <Button onClick={addQuestionHandler} variant="default">
        Add
      </Button>
    </div>
  );
}
