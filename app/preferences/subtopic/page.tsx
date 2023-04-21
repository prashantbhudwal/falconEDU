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
  const [topic, setTopic] = useAtom(topicAtom);
  const { content, startStreaming } = usePrediction(topic);
  const [allContent, setAllContent] = useState([""]);
  const [subtopic, setSubtopic] = useAtom(subtopicAtom);
  const [started, setStarted] = useAtom(startedAtom);
  const [lessonIdeas, setLessonIdeas] = useAtom(lessonIdeasAtom);
  const router = useRouter();

  const handleStart = () => {
    router.push("/merlin");
    setStarted(true);
    setLessonIdeas([]);
  };
  const handleChange = (event: any) => {
    setSubtopic(event.target.value);
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
          value={subtopic}
          onChange={handleChange}
          className="border-slate-700 rounded-md bg-slate-300 text-black p-4 w-96"
          placeholder="Enter a topic"
        />

        <button
          className="bg-emerald-400 ring-1 ring-slate-700 text-slate-700 rounded-md px-8 py-2 text-lg font-medium capitalize disabled:opacity-50"
          onClick={handleStart}
          disabled={!subtopic}
        >
          New Lesson
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
            selectedOption={subtopic}
            handleChange={handleChange}
          />
        )
      )}
    </div>
  );
}
