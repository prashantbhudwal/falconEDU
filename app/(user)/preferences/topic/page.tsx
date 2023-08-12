"use client";
import { PropagateLoader } from "react-spinners";
import { usePrediction } from "@/app/(user)/preferences/hooks/usePrediction";
import { contentStreamCompletedAtom } from "@/atoms/lesson";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import PredictionGrid from "../PredictionGrid";
import { topicAtom, subtopicAtom } from "@/atoms/preferences";
import { useRouter } from "next/navigation";
import { gradeAtom, boardAtom, subjectAtom } from "@/atoms/preferences";
import { userFlowAtom } from "@/atoms/app";
import usePreferences from "@/hooks/usePreferences";
export default function Page() {
  const [subtopic, setSubtopic] = useAtom(subtopicAtom);
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
    setSubtopic("");
    startStreaming();
  }, []);

  useEffect(() => {
    if (contentStreamCompleted) {
      setAllContent(content);
    }
  }, [contentStreamCompleted]);

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
          disabled={!topic || !contentStreamCompleted}
          className={`join-item my-auto ${
            userFlow === "worksheet" ? "btn btn-secondary" : "btn btn-primary"
          }`}
        >
          Next
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
