"use client";
import { PropagateLoader } from "react-spinners";
import { usePrediction } from "@/app/(falcon)/preferences/hooks/usePrediction";
import { contentStreamCompletedAtom } from "@/atoms/lesson";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import CheckboxGrid from "../CheckboxGrid";
import { topicAtom, subtopicAtom } from "@/atoms/preferences";
import { startedAtom } from "@/atoms/app";
import { lessonIdeasAtom } from "@/atoms/lesson";
import { useRouter } from "next/navigation";
import { gradeAtom, boardAtom, subjectAtom } from "@/atoms/preferences";
import { worksheetSubtopicsAtom } from "@/atoms/worksheet";
import { savedQuestionsAtom } from "@/atoms/worksheet";
import { userFlowAtom } from "@/atoms/app";

export default function Page() {
  const [userFlow] = useAtom(userFlowAtom);
  const [lastIndex, setLastIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [contentStreamCompleted] = useAtom(contentStreamCompletedAtom);
  const [topic] = useAtom(topicAtom);
  const [allContent, setAllContent] = useState([""]);
  const [inputValue, setInputValue] = useState("");
  const [_, setStarted] = useAtom(startedAtom);
  const router = useRouter();
  const { content, startStreaming } = usePrediction(topic, "predictSubtopics");
  const [board] = useAtom(boardAtom);
  const [subject] = useAtom(subjectAtom);
  const [grade] = useAtom(gradeAtom);
  const [worksheetSubtopics, setWorksheetSubtopics] = useAtom(
    worksheetSubtopicsAtom
  );
  const [__, setLessonIdeas] = useAtom(lessonIdeasAtom);
  const [savedQuestions, setSavedQuestions] = useAtom(savedQuestionsAtom);

  useEffect(() => {
    if (board === "" || subject === "" || grade === "") {
      router.push("/preferences");
    }
  }, [board, subject, grade, router]);

  const handleRaptorStart = () => {
    router.push("/raptor");
    setStarted(true);
    setSavedQuestions([
      {
        type: "fillInTheBlanks",
        questions: [],
      },
      {
        type: "multipleChoiceSingleCorrect",
        questions: [],
      },
      {
        type: "trueFalse",
        questions: [],
      },
      {
        type: "shortAnswer",
        questions: [],
      },
      {
        type: "essay",
        questions: [],
      },
      {
        type: "project",
        questions: [],
      },
      {
        type: "debate",
        questions: [],
      },
      {
        type: "brainstorming",
        questions: [],
      },
      {
        type: "groupDiscussion",
        questions: [],
      },
    ]);
  };

  const handleMerlinStart = () => {
    router.push("/merlin");
    setStarted(true);
    setLessonIdeas([]);
  };

  const handleChange = (event: any) => {
    setInputValue(event.target.value);
  };

  const handleAddSubtopic = () => {
    if (inputValue) {
      setWorksheetSubtopics([...worksheetSubtopics, inputValue]);
      setInputValue("");
      setHoverIndex(null); // Add this line to reset hoverIndex
    }
  };
  const handleDeleteSubtopic = (index: number) => {
    setWorksheetSubtopics(worksheetSubtopics.filter((_, i) => i !== index));
  };
  useEffect(() => {
    setWorksheetSubtopics([]);
    startStreaming();
  }, []);

  useEffect(() => {
    if (contentStreamCompleted) {
      setAllContent(content);
    }
  }, [contentStreamCompleted]);

  return (
    <div className="flex flex-col gap-10 items-center m-4 w-full">
      <div className="flex  w-5/6  join justify-center items-center">
        <div className="join-item flex flex-row flex-wrap gap-3 px-6 py-4 rounded-md ring-base-100 ring-2 w-4/6 min-h-[4rem]">
          {worksheetSubtopics.map((subtopic, index) => (
            <div
              className="relative"
              key={index}
              onMouseEnter={() => {
                setHoverIndex(index);
                setLastIndex(index);
              }}
              onMouseLeave={() => {
                setHoverIndex(null);
                setLastIndex(null);
              }}
            >
              <div
                className="text-sm px-2 py-2 rounded-sm bg-slate-800 text-secondary cursor-pointer"
                onClick={() => handleDeleteSubtopic(index)}
              >
                {subtopic}
              </div>
              {hoverIndex === index && lastIndex === index && (
                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center text-white text-lg pointer-events-none">
                  ❌
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          className={`btn ${
            userFlow === "worksheet" ? "btn-secondary" : "btn-primary"
          } btn-secondary join-item h-full min-h-[4rem]`}
          onClick={
            userFlow === "worksheet" ? handleRaptorStart : handleMerlinStart
          }
          disabled={worksheetSubtopics.length === 0 || !contentStreamCompleted}
        >
          {userFlow === "worksheet" ? "Worksheet" : "Lesson"}
        </button>
      </div>
      <div className="join">
        <input
          className="input input-bordered w-96 join-item"
          value={inputValue}
          onChange={handleChange}
          placeholder="Add custom..."
        />
        <button
          className=" join-item btn btn-square btn-neutral"
          onClick={handleAddSubtopic}
          disabled={!inputValue}
        >
          <svg
            className="h-6 w-6 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      {!contentStreamCompleted ? (
        <div className="flex flex-col items-center justify-center gap-2 h-12">
          <PropagateLoader color="#D946EF" />
        </div>
      ) : (
        contentStreamCompleted &&
        allContent && (
          <CheckboxGrid
            content={allContent}
            selectedOptions={worksheetSubtopics}
            handleChange={(event) => {
              const selectedOption = event.target.value;
              if (event.target.checked) {
                setWorksheetSubtopics([...worksheetSubtopics, selectedOption]);
              } else {
                setWorksheetSubtopics(
                  worksheetSubtopics.filter(
                    (option) => option !== selectedOption
                  )
                );
              }
            }}
          />
        )
      )}
    </div>
  );
}
