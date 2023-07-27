"use client";
import { PropagateLoader } from "react-spinners";
import { usePrediction } from "@/app/(falcon)/preferences/hooks/usePrediction";
import { contentStreamCompletedAtom } from "@/atoms/lesson";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import PredictionGrid from "../PredictionGrid";
import { topicAtom, subtopicAtom } from "@/atoms/preferences";
import { useRouter } from "next/navigation";
import { gradeAtom, boardAtom, subjectAtom } from "@/atoms/preferences";
import { userFlowAtom } from "@/atoms/app";

export default function Page() {
  const [contentStreamCompleted] = useAtom(contentStreamCompletedAtom);
  const [subject] = useAtom(subjectAtom);
  const [allContent, setAllContent] = useState([""]);
  const [topic, setTopic] = useAtom(topicAtom);
  const router = useRouter();
  const { content, startStreaming } = usePrediction(subject, "predictChapters");
  const [board] = useAtom(boardAtom);
  const [grade] = useAtom(gradeAtom);
  const [userFlow] = useAtom(userFlowAtom);

  //Todo Replace this with a custom hook
  useEffect(() => {
    if (board === "" || subject === "" || grade === "") {
      router.push("/preferences");
    }
  }, [board, subject, grade, router]);
  const handleTopicChange = (event: any) => {
    setTopic(event.target.value);
  };

  useEffect(() => {
    setTopic("");
    startStreaming();
  }, []);

  useEffect(() => {
    if (contentStreamCompleted) {
      setAllContent(content);
    }
  }, [contentStreamCompleted]);

  return (
    <div className="flex flex-col gap-10 items-center m-4">
      <div className="join">
        <input
          className="input input-bordered w-96 join-item"
          value={topic}
          onChange={handleTopicChange}
          placeholder="Enter a chapter..."
        />
        <button
          onClick={() => router.push("/preferences/multipleSubtopics")}
          disabled={!topic || !contentStreamCompleted}
          className={`my-auto join-item ${
            userFlow === "worksheet" ? "btn btn-secondary" : "btn btn-primary"
          }`}
        >
          Next
        </button>
      </div>

      {!contentStreamCompleted ? (
        <div className="flex flex-col items-center justify-center gap-2 h-12">
          <PropagateLoader
            color={`${userFlow === "worksheet" ? "#D946EF" : "#10B981"}`}
          />
        </div>
      ) : (
        contentStreamCompleted &&
        allContent && (
          <PredictionGrid
            className={`${
              userFlow === "worksheet" ? "bg-secondary" : "bg-primary"
            }`}
            content={allContent}
            selectedOption={topic}
            handleChange={handleTopicChange}
          />
        )
      )}
    </div>
  );
}
