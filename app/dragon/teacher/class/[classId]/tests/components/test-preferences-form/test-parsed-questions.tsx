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
  const bottomItemRef = useRef<HTMLDivElement>(null);

  const exampleQuestion = {
    id: nanoid(),
    botConfigId: botId,
    question_type: "OBJECTIVE_MULTIPLE_CHOICE_SINGLE_ANSWER" as const,
    question: "",
    hint: null,
    question_number: 1,
    options: [],
    correct_answer: [],
    sample_answer: null,
    max_score: null,
    isArchived: false,
  };

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
  }, [addedQuestions, parsedQuestions]);

  // ------------------------------------------------ Adding question to list ------------------------------------------------
  const addQuestionHandler = () => {
    setAddedQuestions((prev) => [
      ...prev,
      { ...exampleQuestion, question_number: prev.length + 1 },
    ]);
  };
  // ------------------------------- duplicating questions from added question list --------------------------------------
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
        ...exampleQuestion,
        question,
        correct_answer,
        options,
        question_number: prev.length + 1,
      },
    ]);
  };
  // ----------------------------------- duplicating questions from saved question list ----------------------------------------
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
  // -------------------------------- deleting questions from added question list ---------------------------------------
  const deleteAddQuestion = ({ id }: { id: string }) => {
    const filteredQuestions = addedQuestions.filter(
      (question) => question.id !== id
    );
    setAddedQuestions(filteredQuestions);
  };
  // -------------------------------- create a example MCQ question ---------------------------------------
  const createExampleMCQ = () => {
    setAddedQuestions((prev) => [
      ...prev,
      {
        ...exampleQuestion,
        question_number: prev.length + 1,
        options: ["", "", "", ""],
        correct_answer: [""],
      },
    ]);
  };
  // -------------------------------- create a example Fill in the blanks question ---------------------------------------
  const createExampleFillInTheBlanks = () => {
    setAddedQuestions((prev) => [
      ...prev,
      {
        ...exampleQuestion,
        question_number: prev.length + 1,
        options: [],
        correct_answer: [""],
        question_type: "OBJECTIVE_FILL_IN_THE_BLANK_SINGLE_ANSWER",
      },
    ]);
  };

  useEffect(() => {
    bottomItemRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [addedQuestions]);

  return (
    <>
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
                  ref={
                    index === addedQuestions.length - 1 ? bottomItemRef : null
                  }
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
        {((parsedQuestions && parsedQuestions.length > 0) ||
          (addedQuestions && addedQuestions.length > 0)) && (
          <Actions
            addQuestions={addQuestionHandler}
            createMcq={createExampleMCQ}
            createFillInBlanks={createExampleFillInTheBlanks}
            questionCardHeight={questionCardHeight}
          />
        )}
      </div>
    </>
  );
}
