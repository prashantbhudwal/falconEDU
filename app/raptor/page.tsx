"use client";
import objectHash from "object-hash";
import React, { useState, useEffect } from "react";
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
import {
  motion,
  useAnimation,
  AnimatePresence,
  MotionStyle,
} from "framer-motion";

const questionTypes = [
  { value: "fillInTheBlanks", label: "Fill in the Blanks" },
  { value: "multipleChoiceSingleCorrect", label: "Multiple Choice" },
  { value: "trueFalse", label: "True/False" },
  { value: "shortAnswer", label: "Short Answer" },
  { value: "essay", label: "Essay" },
  { value: "project", label: "Project" },
  { value: "debate", label: "Debate" },
  { value: "brainstorming", label: "Brainstorming" },
  { value: "groupDiscussion", label: "Group Discussion" },
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

  // console.log(savedQuestions);

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
    if (Array.isArray(parsedContent)) {
      let updatedQuestions = [...savedQuestions];

      parsedContent.forEach((content, index) => {
        if ("type" in content) {
          const parsedQuestionType = content.type;
          const questionIndex = updatedQuestions.findIndex(
            (q: any) => q.type === parsedQuestionType
          );

          if (questionIndex !== -1) {
            const questionArray = [
              ...updatedQuestions[questionIndex].questions,
            ];

            // Create a copy of the object, excluding any fields that are not related to the question content
            const contentForHashing = { ...content, index };

            // Generate a hash of the entire object
            const questionId = objectHash(contentForHashing);

            // Check if a question with the same hash already exists
            const existingQuestion = questionArray.find(
              (q) => q.questionId === questionId
            );

            if (!existingQuestion) {
              // Adding id property
              const parsedContentWithId = {
                ...content,
                questionId: questionId,
                bloomLevel: currentQuestion.bloomLevel,
                topic: topic,
                subtopic: currentQuestion.subtopic,
                grade: grade,
                board: board,
              };

              questionArray.push(
                parsedContentWithId as unknown as QuestionItem
              );
              updatedQuestions[questionIndex] = {
                ...updatedQuestions[questionIndex],
                questions: questionArray,
              };
            }
          }
        }
      });

      setSavedQuestions(updatedQuestions);
    }
  }, [parsedContent]);

  useEffect(() => {
    if (isAdvancedMode) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [isAdvancedMode, controls]);

  const circleVariants = {
    hidden: {
      scale: 0,
      opacity: 0,
    },
    visible: {
      scale: [0, 1, 1, 2, 3, 5, 8, 13],
      opacity: [1, 0.75, 0.75, 0.5, 0.25, 0.1, 0.05, 0],
      transition: {
        duration: 1,
        ease: [0.17, 0.84, 0.44, 1],
        times: [0, 0.05, 0.15, 0.25, 0.35, 0.45, 0.55, 1],
      },
    },
  };

  const styles: MotionStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    backgroundColor: "#D946EF",
    zIndex: -1,
    transform: "translate(-50%, -50%)",
  };

  const handleDelete = (question: QuestionItem) => {
    setSavedQuestions((prevSavedQuestions) => {
      return prevSavedQuestions.map((questionObject) => {
        if (questionObject.type === question.type) {
          return {
            ...questionObject,
            questions: questionObject.questions.filter(
              (q) => q.questionId !== question.questionId
            ),
          };
        }
        return questionObject;
      });
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <AnimatePresence>
        {isAdvancedMode && (
          <motion.div
            variants={circleVariants}
            initial="hidden"
            animate={controls}
            exit="hidden"
            style={styles}
          />
        )}
      </AnimatePresence>
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
          isSticky={true}
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
                handleQuestionClick={handleDelete}
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
