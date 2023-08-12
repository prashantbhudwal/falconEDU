"use client";
import { PropagateLoader } from "react-spinners";
import { usePrediction } from "@/app/(user)/preferences/hooks/usePrediction";
import { contentStreamCompletedAtom } from "@/atoms/lesson";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import PredictionGrid from "../PredictionGrid";
import { topicAtom, subtopicAtom } from "@/atoms/preferences";
import { startedAtom } from "@/atoms/app";
import { lessonIdeasAtom } from "@/atoms/lesson";
import { useRouter } from "next/navigation";
import { gradeAtom, boardAtom, subjectAtom } from "@/atoms/preferences";
export default function Page() {
  const [contentStreamCompleted] = useAtom(contentStreamCompletedAtom);
  const [topic] = useAtom(topicAtom);
  const [allContent, setAllContent] = useState([""]);
  const [subtopic, setSubtopic] = useAtom(subtopicAtom);
  const [_, setStarted] = useAtom(startedAtom);
  const [__, setLessonIdeas] = useAtom(lessonIdeasAtom);
  const router = useRouter();
  const { content, startStreaming } = usePrediction(topic, "predictSubtopics");
  const [board] = useAtom(boardAtom);
  const [subject] = useAtom(subjectAtom);
  const [grade] = useAtom(gradeAtom);

  useEffect(() => {
    if (board === "" || subject === "" || grade === "") {
      router.push("/preferences");
    }
  }, [board, subject, grade, router]);

  const handleStart = () => {
    router.push("/merlin");
    setStarted(true);
    setLessonIdeas([]);
  };
  const handleChange = (event: any) => {
    setSubtopic(event.target.value);
  };

  useEffect(() => {
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
          value={subtopic}
          onChange={handleChange}
          placeholder="Enter any topic..."
        />

        <button
          onClick={handleStart}
          disabled={!subtopic || !contentStreamCompleted}
          className={`btn btn-primary join-item my-auto`}
        >
          New Lesson
        </button>
      </div>

      {!contentStreamCompleted ? (
        <div className="flex h-12 flex-col items-center justify-center gap-2">
          <PropagateLoader color="#10B981" />
        </div>
      ) : (
        contentStreamCompleted &&
        allContent && (
          <PredictionGrid
            content={allContent}
            selectedOption={subtopic}
            handleChange={handleChange}
            className="bg-primary"
          />
        )
      )}
    </div>
  );
}
