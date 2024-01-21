"use client";
import {
  typeActiveParsedQuestionByBotConfigId,
  typeArchivedParsedQuestionByBotConfigId,
} from "@/app/dragon/teacher/routers/parsedQuestionRouter";
import { QuestionForm } from "./question-form";
import React, { useEffect, useRef, useState } from "react";
import { AddQuestionForm } from "./add-question-form";
import { nanoid } from "nanoid";
import { Actions } from "./actions";
import { z } from "zod";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArchivedQuestions } from "./archived-questions";
import { parsedQuestionsSchema } from "@/lib/schema";

export function TestParsedQuestion({
  activeParsedQuestions,
  archivedParsedQuestions,
  botId,
  classId,
}: {
  activeParsedQuestions: typeActiveParsedQuestionByBotConfigId[];
  archivedParsedQuestions: typeArchivedParsedQuestionByBotConfigId[];
  botId: string;
  classId: string;
}) {
  const [addedQuestions, setAddedQuestions] = useState<
    typeActiveParsedQuestionByBotConfigId[] | []
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
    options: [""],
    correct_answer: [""],
    sample_answer: null,
    max_score: null,
    isArchived: false,
    isPossiblyWrong: false,
    isPossiblyWrongDesc: "",
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
  }, [addedQuestions, activeParsedQuestions]);

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
        question_type:
          data.question_type || "OBJECTIVE_MULTIPLE_CHOICE_SINGLE_ANSWER",
        isPossiblyWrong: false, // TODO: Fix dummy values if needed
        isPossiblyWrongDesc: "",
      },
    ]);
  };
  // ----------------------------------- duplicating questions from saved question list ----------------------------------------
  const duplicateSavedQuestionHandler = ({
    data,
  }: {
    data: typeActiveParsedQuestionByBotConfigId;
  }): void => {
    setAddedQuestions((prev) => [
      ...prev,
      {
        ...data,
        question_number: prev.length + 1,
        id: nanoid(),
      },
    ]);
  };
  // -------------------------------- deleting questions from added question list ---------------------------------------
  const deleteAddQuestion = ({ id }: { id: string }) => {
    const filteredQuestions = addedQuestions.filter(
      (question) => question.id !== id,
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
      <div className="relative mx-auto w-11/12">
        <div ref={containerRef} className="flex flex-col space-y-3">
          {activeParsedQuestions &&
            activeParsedQuestions.length > 0 &&
            activeParsedQuestions.map((question, index) => (
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
                    activeParsedQuestions
                      ? activeParsedQuestions.length + index + 1
                      : index + 1
                  }
                  deleteQuestions={deleteAddQuestion}
                />
              );
            })}
        </div>
        {((activeParsedQuestions && activeParsedQuestions.length > 0) ||
          (addedQuestions && addedQuestions.length > 0)) && (
          <Actions
            addQuestions={addQuestionHandler}
            createMcq={createExampleMCQ}
            createFillInBlanks={createExampleFillInTheBlanks}
            questionCardHeight={questionCardHeight}
          />
        )}
      </div>
      <Accordion
        type="single"
        collapsible
        className="mx-auto my-10 w-11/12 bg-slate-900/70 text-slate-500"
      >
        <div className="mx-auto w-11/12">
          <AccordionItem value="item-1" className="border-none">
            <AccordionTrigger className="text-slate-400">
              Deleted Questions
            </AccordionTrigger>
            <AccordionContent>
              <ArchivedQuestions archivedQuestions={archivedParsedQuestions} />
            </AccordionContent>
          </AccordionItem>
        </div>
      </Accordion>
    </>
  );
}
