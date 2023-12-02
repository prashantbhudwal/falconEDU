"use client";
import { typeGetParsedQuestionByBotConfigId } from "@/app/dragon/teacher/routers/parsedQuestionRouter";
import { QuestionForm } from "./question-form";
import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState } from "react";
import { parsedQuestionsSchema } from "@/app/dragon/schema";
import { AddQuestionForm } from "./add-question-form";
import { nanoid } from "nanoid";
import { Actions } from "./actions";
import { ZodType, z } from "zod";

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
  const [questionCardHeight, setQuestionCardHeight] = useState(218);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      const lastChild = entries[0].target;
      setQuestionCardHeight(lastChild.clientHeight);
    });

    const lastChild =
      containerRef.current?.children[containerRef.current?.children.length - 1];
    if (lastChild) {
      resizeObserver.observe(lastChild);
    }

    return () => {
      if (lastChild) {
        resizeObserver.unobserve(lastChild);
      }
    };
  }, [addedQuestions]);

  const addQuestionHandler = () => {
    setAddedQuestions((prev) => [
      ...prev,
      {
        id: nanoid(),
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

  const duplicateQuestionHandler = ({
    data,
  }: {
    data: Partial<z.infer<typeof parsedQuestionsSchema>>;
  }) => {
    const options = data.options
      ? data.options.map((option) => option.value)
      : [];
    const correct_answer = data.correct_answer
      ? data.correct_answer.map((answer) => answer.value)
      : [];
    const question = data.question ? data.question : "";

    setAddedQuestions((prev) => [
      ...prev,
      {
        id: nanoid(),
        botConfigId: botId,
        question_type: "OBJECTIVE_MULTIPLE_CHOICE_SINGLE_ANSWER",
        question,
        hint: null,
        question_number: prev.length + 1,
        options,
        correct_answer,
        sample_answer: null,
        max_score: null,
        isArchived: false,
      },
    ]);
  };

  const duplicateSavedQuestionHandler = ({
    data,
  }: {
    data: NonNullable<typeGetParsedQuestionByBotConfigId>[number];
  }) => {
    setAddedQuestions((prev) => [
      ...prev,
      {
        ...data,
        question_number: prev.length + 1,
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
    <div className="relative w-11/12 mx-auto">
      <div ref={containerRef} className="flex flex-col space-y-3">
        {parsedQuestions &&
          parsedQuestions.length > 0 &&
          parsedQuestions.map((question, index) => (
            <QuestionForm
              key={question.id}
              createDuplicate={duplicateSavedQuestionHandler}
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
                createDuplicate={duplicateQuestionHandler}
                question={question}
                questionNumber={
                  parsedQuestions
                    ? parsedQuestions.length + index + 1
                    : index + 1
                }
                deleteQuestions={deleteAddQuestion}
              />
            );
          })}
      </div>
      <Actions
        addQuestions={addQuestionHandler}
        createDuplicate={duplicateQuestionHandler}
        questionCardHeight={questionCardHeight}
      />
    </div>
  );
}
