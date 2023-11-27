"use client";
import { GridLoader } from "react-spinners";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import PredictionGrid from "../prediction-grid";
import { topicAtom, subtopicAtom } from "@/lib/atoms/preferences";
import { useRouter } from "next/navigation";
import { gradeAtom, boardAtom, subjectAtom } from "@/lib/atoms/preferences";
import { userFlowAtom } from "@/lib/atoms/app";
import { Button } from "@/components/ui/button";
const API_URL = "/ai/predictor";

const fetchPredictions = async (
  subject: string,
  board: string,
  grade: string
) => {
  const chaptersJson = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      predictionType: "predictChapters",
      data: {
        subject,
        board,
        grade,
      },
    }),
  });
  if (!chaptersJson.ok) {
    throw new Error("Something went wrong");
  }
  const chapters = await chaptersJson.json();
  return chapters;
};

export default function Page() {
  const [retryFetch, setRetryFetch] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [_, setSubtopic] = useAtom(subtopicAtom);
  const [subject] = useAtom(subjectAtom);
  const [chapters, setChapters] = useState([""]);
  const [topic, setTopic] = useAtom(topicAtom);
  const router = useRouter();
  const [board] = useAtom(boardAtom);
  const [grade] = useAtom(gradeAtom);
  const [userFlow] = useAtom(userFlowAtom);
  const handleTopicChange = (event: any) => {
    setTopic(event.target.value);
  };

  const handleRetry = () => {
    setRetryFetch((prev) => !prev);
  };

  //Todo Replace this with a custom hook
  useEffect(() => {
    setTopic("");
    setSubtopic("");
    if (board === "" || subject === "" || grade === "") {
      router.push("/preferences");
    }
  }, [board, subject, grade, router]);

  useEffect(() => {
    if (!subject || !board || !grade) return;
    const predict = async (subject: string, board: string, grade: string) => {
      setLoading(true);
      try {
        const chapters = await fetchPredictions(subject, board, grade);
        setChapters(chapters);
        setError(false);
      } catch (error) {
        setError(true);
      }
    };
    predict(subject, board, grade).then(() => setLoading(false));
  }, [retryFetch, subject, board, grade]);

  return (
    <div className="m-4 flex flex-col items-center gap-10">
      <div className="join">
        <input
          className="input join-item input-bordered w-96"
          value={topic}
          onChange={handleTopicChange}
          placeholder="Enter a chapter..."
        />
        <button
          onClick={() => router.push("/preferences/multipleSubtopics")}
          disabled={!topic || loading}
          className={`join-item my-auto ${
            userFlow === "worksheet" ? "btn btn-secondary" : "btn btn-primary"
          }`}
        >
          Next
        </button>
      </div>
      {loading ? (
        <div className="flex h-12 flex-col items-center justify-center gap-2">
          <GridLoader
            color={`${userFlow === "worksheet" ? "#D946EF" : "#10B981"}`}
          />
        </div>
      ) : error ? (
        // Todo: Add a retry button
        <>
          <div className="flex h-12 flex-col items-center justify-center gap-2">
            <p className="text-red-500">Something went wrong with AI.</p>
          </div>
          <Button onClick={handleRetry}>Retry</Button>
        </>
      ) : (
        <PredictionGrid
          className={`${
            userFlow === "worksheet" ? "bg-secondary" : "bg-primary"
          }`}
          content={chapters}
          selectedOption={topic}
          handleChange={handleTopicChange}
        />
      )}
    </div>
  );
}
