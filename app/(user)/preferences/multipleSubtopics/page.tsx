"use client";
import { PropagateLoader } from "react-spinners";
import { usePrediction } from "@/app/(user)/preferences/hooks/usePrediction";
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
    <div className="m-4 flex w-full flex-col items-center gap-10">
      <div className="join  flex  w-5/6 items-center justify-center">
        <div className="join-item flex min-h-[4rem] w-4/6 flex-row flex-wrap gap-3 rounded-md px-6 py-4 ring-2 ring-base-100">
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
                className={`rounded-sm bg-slate-800 p-2 text-sm${
                  userFlow === "worksheet" ? "text-secondary" : "text-primary"
                } cursor-pointer`}
                onClick={() => handleDeleteSubtopic(index)}
              >
                {subtopic}
              </div>
              {hoverIndex === index && lastIndex === index && (
                <div className="pointer-events-none absolute left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50 text-lg text-white">
                  ❌
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          className={`btn ${
            userFlow === "worksheet" ? "btn-secondary" : "btn-primary"
          } join-item h-full min-h-[4rem]`}
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
          className="input join-item input-bordered w-96"
          value={inputValue}
          onChange={handleChange}
          placeholder="Add custom subtopics..."
        />
        <button
          className=" btn btn-square btn-neutral join-item"
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
        <div className="flex h-12 flex-col items-center justify-center gap-2">
          <PropagateLoader
            color={`${userFlow === "worksheet" ? "#D946EF" : "#10B981"}`}
          />
        </div>
      ) : (
        contentStreamCompleted &&
        allContent && (
          <CheckboxGrid
            userFlow={userFlow}
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
