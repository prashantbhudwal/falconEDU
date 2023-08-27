"use client";
import { itemTypes } from "../../../config/itemTypes";
import objectHash from "object-hash";
import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar";
import Section from "../../../components/Section";
import Canvas from "./components/Canvas";
import DraggableChip from "../../../components/DraggableChip";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { QuestionType, QuestionItem, QuestionObject } from "@/types";
import { currentQuestionAtom } from "../../../lib/atoms/worksheet";
import { useAtom } from "jotai";
import { useQuestionGeneration } from "./hooks/useQuestionGeneration";
import { contentStreamCompletedAtom } from "@/lib/atoms/lesson";
import {
  worksheetSubtopicsAtom,
  worksheetAnswerKeyAtom,
  savedQuestionsAtom,
  isAdvancedModeAtom,
  batchSizeAtom,
} from "../../../lib/atoms/worksheet";
import {
  topicAtom,
  gradeAtom,
  boardAtom,
  subjectAtom,
} from "../../../lib/atoms/preferences";
import { RiseLoader, SyncLoader } from "react-spinners";
import QuestionsBlock from "./components/QuestionSection";
import useJsonParsing from "../../../hooks/useJsonParsing";
import { ModeToggle } from "./components/ModeToggle";
import { motion, useAnimation } from "framer-motion";
import { BatchSize } from "./components/BatchSize";
import { useRouter } from "next/navigation";
import MerlinGrid from "../(merlin)/components/Grid";
const questionTypes = [
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
  const [worksheetAnswerKey, setWorksheetAnswerKey] = useAtom(
    worksheetAnswerKeyAtom
  );
  const [checkedQuestionTypes, setCheckedQuestionTypes] = useState<
    QuestionType[]
  >(["multipleChoiceSingleCorrect"]);
  const [isAdvancedMode, setIsAdvancedMode] = useAtom(isAdvancedModeAtom);
  const [firstRender, setFirstRender] = useState(true);
  const [batchSize, setBatchSize] = useAtom(batchSizeAtom);
  const router = useRouter();

  const handleWorksheetGeneration = () => {
    setWorksheetAnswerKey([]);
    router.push("/raptor/magic/worksheet");
  };
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
      <motion.div
        className="grid h-full w-full select-none grid-cols-12 gap-4 overflow-y-auto"
        animate={controls}
      >
        <Sidebar className="col-span-3 col-start-1 row-start-1">
          <Section title={"Topics"} color={"gray"}>
            {worksheetSubtopics.length > 0 &&
              worksheetSubtopics.map((topic, index) => (
                <DraggableChip
                  key={index}
                  color="secondary"
                  type={itemTypes.TOPIC}
                >
                  {topic}
                </DraggableChip>
              ))}
          </Section>
        </Sidebar>
        <div
          className={`custom-scrollbar } col-span-7 col-start-4 mt-1 flex flex-col items-center gap-4 overflow-y-scroll scroll-smooth bg-slate-950 px-5 py-3 pb-96 shadow-md marker:h-full`}
        >
          <div className="flex flex-row items-center gap-12">
            <ModeToggle
              isAdvancedMode={isAdvancedMode}
              setIsAdvancedMode={setIsAdvancedMode}
            />
            <BatchSize />
          </div>

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
        </div>
        <Sidebar className="col-span-2 col-start-11">
          <Section title={"Types"} color={"gray"}>
            {questionTypes.map((questionType) => (
              <label className="label text-sm" key={questionType.value}>
                <span className={"label-text"}>{questionType.label}</span>
                <input
                  type="checkbox"
                  name="questionType"
                  value={questionType.value}
                  checked={checkedQuestionTypes.includes(questionType.value)}
                  onChange={() => handleCheckboxChange(questionType.value)}
                  className="checkbox-info checkbox checkbox-sm"
                />
              </label>
            ))}
          </Section>
        </Sidebar>
      </motion.div>
    </DndProvider>
  );
}
