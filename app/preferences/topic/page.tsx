"use client";
import { PropagateLoader } from "react-spinners";
import { usePrediction } from "@/app/hooks/usePrediction";
import { contentStreamCompletedAtom } from "@/app/atoms/lesson";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { shouldRegenerateAtom } from "@/app/atoms/lesson";
import PredictionGrid from "../PredictionGrid";
import { topicAtom, subtopicAtom } from "@/app/atoms/preferences";
import { startedAtom } from "@/app/atoms/app";
import { lessonIdeasAtom } from "@/app/atoms/lesson";
import { useRouter } from "next/navigation";
import { subjectAtom } from "../../atoms/preferences";

export default function Page() {
  const [contentStreamCompleted] = useAtom(contentStreamCompletedAtom);
  const [subject] = useAtom(subjectAtom);
  const { content, startStreaming } = usePrediction(subject);
  const [allContent, setAllContent] = useState([""]);
  const [topic, setTopic] = useAtom(topicAtom);
  const router = useRouter();

  const handleTopicChange = (event: any) => {
    setTopic(event.target.value);
  };

  useEffect(() => {
    startStreaming();
  }, []);

  useEffect(() => {
    if (contentStreamCompleted) {
      setAllContent(content);
    }
  }, [contentStreamCompleted]);

  return (
    <div className="flex flex-col gap-6 items-center m-4">
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          id="inputText"
          value={topic}
          onChange={handleTopicChange}
          className="border-slate-700 rounded-md bg-slate-300 text-black p-4 w-96"
          placeholder="Enter a topic"
        />
        <button
          className="bg-emerald-500 ring-1 ring-slate-700 text-slate-700 rounded-md px-8 py-2 text-lg font-medium capitalize disabled:opacity-50"
          onClick={() => router.push("/preferences/subtopic")}
          disabled={!topic}
        >
          Next
        </button>
      </div>

      {!contentStreamCompleted ? (
        <div className="flex flex-col items-center justify-center gap-2 h-12">
          <PropagateLoader color="#10B981" />
        </div>
      ) : (
        contentStreamCompleted &&
        allContent && (
          <PredictionGrid
            content={allContent}
            selectedOption={topic}
            handleChange={handleTopicChange}
          />
        )
      )}
    </div>
  );
}
