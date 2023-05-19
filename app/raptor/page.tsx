"use client";
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Sidebar from "../components/Sidebar";
import Section from "../components/Section";
import Canvas from "./components/Canvas";
import ChipDrag from "./components/ChipDrag";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import Checkbox from "../components/Checkbox";
import { QuestionType, QuestionItem, QuestionObject } from "@/types";
import { currentQuestionAtom } from "../atoms/worksheet";
import { useAtom } from "jotai";
import { useQuestionGeneration } from "./hooks/useQuestionGeneration";
import { contentStreamCompletedAtom } from "@/app/atoms/lesson";
import {
  worksheetSubtopicsAtom,
  savedQuestionsAtom,
  isAdvancedModeAtom,
} from "../atoms/worksheet";
import {
  topicAtom,
  gradeAtom,
  boardAtom,
  subjectAtom,
} from "../atoms/preferences";
import { RiseLoader } from "react-spinners";
import QuestionsBlock from "./components/QuestionSection";
import useJsonParsing from "../hooks/useJsonParsing";
import { ModeToggle } from "./components/ModeToggle";
import { motion, useAnimation } from "framer-motion";

const questionTypes = [
  { value: "fillInTheBlanks", label: "Fill in the Blanks" },
  { value: "multipleChoiceSingleCorrect", label: "Multiple Choice" },
  { value: "trueFalse", label: "True/False" },
  { value: "shortAnswer", label: "Short Answer" },
  { value: "essay", label: "Essay" },
] as { value: QuestionType; label: string }[];

export default function Raptor() {
  const controls = useAnimation();
  const { content, startStreaming } = useQuestionGeneration("getQuestion");
  const [savedQuestions, setSavedQuestions] = useAtom(savedQuestionsAtom);
  const [topic] = useAtom(topicAtom);
  const [grade] = useAtom(gradeAtom);
  const [board] = useAtom(boardAtom);
  const [subject] = useAtom(subjectAtom);
  const [currentQuestion, setCurrentQuestion] = useAtom(currentQuestionAtom);
  const [contentStreamCompleted] = useAtom(contentStreamCompletedAtom);
  const [worksheetSubtopics] = useAtom(worksheetSubtopicsAtom);
  const [checkedQuestionTypes, setCheckedQuestionTypes] = useState<
    QuestionType[]
  >(["fillInTheBlanks"]);
  const [isAdvancedMode, setIsAdvancedMode] = useAtom(isAdvancedModeAtom);
  const [firstRender, setFirstRender] = useState(true);

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
    if (firstRender) {
      // Skipping first render
      setFirstRender(false);
    } else if (currentQuestion.bloomLevel.length > 0) {
      // This code won't run on the first render
      startStreaming();
    }
  }, [currentQuestion]);

  useEffect(() => {
    if (parsedContent && "type" in parsedContent) {
      const parsedQuestionType = parsedContent.type;
      const questionIndex = savedQuestions.findIndex(
        (q: any) => q.type === parsedQuestionType
      );

      if (questionIndex !== -1) {
        const updatedQuestions = [...savedQuestions];
        const questionArray = [...updatedQuestions[questionIndex].questions];

        // Adding id property
        const parsedContentWithId = {
          ...parsedContent,
          questionId: uuidv4(),
          bloomLevel: currentQuestion.bloomLevel,
          topic: topic,
          subtopic: currentQuestion.subtopic,
          grade: grade,
          board: board,
        };

        questionArray.push(parsedContentWithId as unknown as QuestionItem);
        updatedQuestions[questionIndex] = {
          ...updatedQuestions[questionIndex],
          questions: questionArray,
        };

        setSavedQuestions(updatedQuestions);
      }
    }
  }, [parsedContent]);

  useEffect(() => {
    if (isAdvancedMode) {
      controls.start({
        scale: [1, 0.9, 1],
        transition: { duration: 0.6 },
      });
    }
  }, [isAdvancedMode, controls]);

  return (
    <DndProvider backend={HTML5Backend}>
      <motion.div
        className="grid grid-cols-12 gap-4 w-full select-none"
        animate={controls}
      >
        <Sidebar className="col-start-1 col-span-3 row-start-1">
          <Section title={"Topics"} color={"gray"}>
            {worksheetSubtopics.length > 0 &&
              worksheetSubtopics.map((topic, index) => (
                <ChipDrag key={index} color="secondary">
                  {topic}
                </ChipDrag>
              ))}
          </Section>
        </Sidebar>
        <Canvas
          className={`col-start-4 col-span-7 h-screen scroll-smooth overflow-y-auto scroll-pb-96 pb-96 custom-scrollbar items-center gap-4 }`}
          color="secondary"
          heading={
            contentStreamCompleted ? topic : <RiseLoader color="#D946EF" />
          }
          leftTop={`Grade ${grade}`}
          leftBottom={subject}
          rightTop={board}
        >
          <ModeToggle
            isAdvancedMode={isAdvancedMode}
            setIsAdvancedMode={setIsAdvancedMode}
          />
          {savedQuestions.map((questionObject: QuestionObject) => {
            return !checkedQuestionTypes.includes(
              questionObject.type
            ) ? null : (
              <QuestionsBlock
                questions={questionObject.questions}
                type={questionObject.type}
                key={questionObject.type}
                droppable={isAdvancedMode ? false : true}
                hasBloom={isAdvancedMode}
              />
            );
          })}
        </Canvas>
        <Sidebar className="col-start-11 col-span-2">
          <Section title={"Types"} color={"gray"}>
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
      </motion.div>
    </DndProvider>
  );
}
