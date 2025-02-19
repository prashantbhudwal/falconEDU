"use client";
import { GridLoader } from "react-spinners";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import CheckboxGrid from "../checkbox-grid";
import { topicAtom, subtopicAtom } from "@/lib/atoms/preferences";
import { startedAtom } from "@/lib/atoms/app";
import { lessonIdeasAtom } from "@/lib/atoms/lesson";
import { useRouter } from "next/navigation";
import { gradeAtom, boardAtom, subjectAtom } from "@/lib/atoms/preferences";
import { subtopicsAtom } from "@/lib/atoms/preferences";
import { savedQuestionsAtom } from "@/lib/atoms/worksheet";
import { userFlowAtom } from "@/lib/atoms/app";
import { Button } from "@/components/ui/button";

const fetchPredictions = async (
  topic: string,
  subject: string,
  board: string,
  grade: string,
) => {
  const topicsJson = await fetch("/ai/predictor", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      predictionType: "predictTopics",
      data: {
        chapter: topic,
        subject,
        board,
        grade,
      },
    }),
  });
  if (!topicsJson.ok) {
    throw new Error("Something went wrong");
  }
  const topics = await topicsJson.json();
  return topics;
};

export default function Page() {
  const [retryFetch, setRetryFetch] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userFlow] = useAtom(userFlowAtom);
  const [lastIndex, setLastIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [topic] = useAtom(topicAtom);
  const [allContent, setAllContent] = useState([""]);
  const [inputValue, setInputValue] = useState("");
  const [_, setStarted] = useAtom(startedAtom);
  const router = useRouter();
  const [board] = useAtom(boardAtom);
  const [subject] = useAtom(subjectAtom);
  const [grade] = useAtom(gradeAtom);
  const [subtopics, setSubtopics] = useAtom(subtopicsAtom);
  const [__, setLessonIdeas] = useAtom(lessonIdeasAtom);
  const [savedQuestions, setSavedQuestions] = useAtom(savedQuestionsAtom);

  const API = "/ai/predictor";
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
  const handleRetry = () => {
    setRetryFetch((prev) => !prev);
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
      setSubtopics([...subtopics, inputValue]);
      setInputValue("");
      setHoverIndex(null); // Add this line to reset hoverIndex
    }
  };
  const handleDeleteSubtopic = (index: number) => {
    setSubtopics(subtopics.filter((_, i) => i !== index));
  };
  useEffect(() => {
    if (!topic || !subject || !board || !grade) return;
    setSubtopics([]);
    setLoading(true);
    const predict = async (
      topic: string,
      subject: string,
      board: string,
      grade: string,
    ) => {
      // post request to the api
      try {
        const topics = await fetchPredictions(topic, subject, board, grade);
        setAllContent(topics);
        setError(false);
      } catch (error) {
        setError(true);
      }
    };
    predict(topic, subject, board, grade).then(() => setLoading(false));
  }, [retryFetch, topic, subject, board, grade]);

  return (
    <div className="m-4 flex w-full flex-col items-center gap-10">
      <div className="join  flex  w-5/6 items-center justify-center">
        <div className="join-item flex min-h-[4rem] w-4/6 flex-row flex-wrap gap-3 rounded-md px-6 py-4 ring-2 ring-base-100">
          {subtopics.map((subtopic, index) => (
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
          disabled={subtopics.length === 0 || loading}
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
          className=" btn btn-square join-item btn-neutral"
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

      {loading ? (
        <div className="flex h-12 flex-col items-center justify-center gap-2">
          <GridLoader
            color={`${userFlow === "worksheet" ? "#D946EF" : "#10B981"}`}
          />
        </div>
      ) : error ? (
        <>
          <div className="flex h-12 flex-col items-center justify-center gap-2">
            <p className="text-red-500">Something went wrong with AI.</p>
          </div>
          <Button onClick={handleRetry}>Retry</Button>
        </>
      ) : (
        <CheckboxGrid
          userFlow={userFlow}
          content={allContent}
          selectedOptions={subtopics}
          handleChange={(event) => {
            const selectedOption = event.target.value;
            if (event.target.checked) {
              setSubtopics([...subtopics, selectedOption]);
            } else {
              setSubtopics(
                subtopics.filter((option) => option !== selectedOption),
              );
            }
          }}
        />
      )}
    </div>
  );
}
