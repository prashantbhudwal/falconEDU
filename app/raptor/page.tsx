"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Section from "./components/Section";
import Canvas from "./components/Canvas";
import ChipDrag from "./components/ChipDrag";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import Checkbox from "./components/Checkbox";
import { QuestionType, Questions, Question } from "@/types";
import { currentQuestionAtom } from "../atoms/worksheet";
import { useAtom } from "jotai";
import { useQuestionGeneration } from "../hooks/useQuestionGeneration";
import { contentStreamCompletedAtom } from "@/app/atoms/lesson";
import { worksheetSubtopicsAtom } from "../atoms/worksheet";
import {
  topicAtom,
  gradeAtom,
  boardAtom,
  subjectAtom,
} from "../atoms/preferences";
import { RiseLoader } from "react-spinners";
import QuestionSection from "./components/QuestionSection";
import useJsonParsing from "../hooks/useJsonParsing";

const questionTypes = [
  { value: "fillInTheBlanks", label: "Fill in the Blanks" },
  { value: "multipleChoiceSingleCorrect", label: "Multiple Choice" },
  { value: "trueFalse", label: "True/False" },
  { value: "shortAnswer", label: "Short Answer" },
  { value: "essay", label: "Essay" },
] as { value: QuestionType; label: string }[];

export default function Raptor() {
  const { content, startStreaming } = useQuestionGeneration("getQuestion");
  const [savedQuestions, setSavedQuestions] = useState<Questions>({
    fillInTheBlanks: [],
    multipleChoiceSingleCorrect: [],
    trueFalse: [],
    shortAnswer: [],
    essay: [],
  });
  const [topic] = useAtom(topicAtom);
  const [grade] = useAtom(gradeAtom);
  const [board] = useAtom(boardAtom);
  const [subject] = useAtom(subjectAtom);
  const [currentQuestion] = useAtom(currentQuestionAtom);
  const [contentStreamCompleted] = useAtom(contentStreamCompletedAtom);
  const [worksheetSubtopics] = useAtom(worksheetSubtopicsAtom);
  const [checkedQuestionTypes, setCheckedQuestionTypes] = useState<
    QuestionType[]
  >([]);

  function isKeyOfQuestions(key: string): key is keyof Questions {
    return key in savedQuestions;
  }
  const handleCheckboxChange = (value: QuestionType) => {
    if (checkedQuestionTypes.includes(value)) {
      setCheckedQuestionTypes(
        checkedQuestionTypes.filter((val) => val !== value)
      );
    } else {
      setCheckedQuestionTypes([...checkedQuestionTypes, value]);
    }
  };

  const parsedContent = useJsonParsing({ contentStreamCompleted, content });

  useEffect(() => {
    if (currentQuestion.bloomLevel.length > 0) {
      //Stops code from running when the page first loads
      startStreaming();
    }
  }, [currentQuestion]);

  useEffect(() => {
    if (parsedContent && "type" in parsedContent) {
      const parsedQuestionType = parsedContent.type as keyof Questions;
      if (Object.keys(savedQuestions).includes(parsedQuestionType)) {
        const questionArray = savedQuestions[parsedQuestionType];
        if (Array.isArray(questionArray)) {
          // type guard
          setSavedQuestions((prevState: Questions) => ({
            ...prevState,
            [parsedQuestionType]: [...questionArray, parsedContent],
          }));
        }
      }
    }
  }, [parsedContent]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-12 gap-4 w-full select-none">
        <Sidebar className="col-start-1 col-span-3 row-start-1">
          <Section title={"Topics"}>
            {worksheetSubtopics.length > 0 &&
              worksheetSubtopics.map((topic, index) => (
                <ChipDrag key={index} color="secondary">
                  {topic}
                </ChipDrag>
              ))}
          </Section>
        </Sidebar>
        <Canvas
          className="col-start-4 col-span-7 h-screen scroll-smooth overflow-y-auto scroll-pb-96 pb-96 custom-scrollbar"
          color="secondary"
          heading={
            contentStreamCompleted ? topic : <RiseLoader color="#D946EF" />
          }
          leftTop={`Grade ${grade}`}
          leftBottom={subject}
          rightTop={board}
        >
          {Object.keys(savedQuestions).map((questionType) => {
            const questionTypeKey = questionType as QuestionType;
            // If the questionType is not in checkedQuestionTypes, return null
            if (!checkedQuestionTypes.includes(questionTypeKey)) {
              return null;
            }
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
        <Sidebar className="col-start-11 col-span-2">
          <Section title={"Types"}>
            {questionTypes.map((questionType) => (
              <Checkbox
                key={questionType.value}
                value={questionType.value}
                label={questionType.label}
                checked={checkedQuestionTypes.includes(questionType.value)}
                onChange={handleCheckboxChange}
              />
            ))}
          </Section>
        </Sidebar>
      </div>
    </DndProvider>
  );
}
