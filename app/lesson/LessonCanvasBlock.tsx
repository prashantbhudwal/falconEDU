"use client";
import { useAppState } from "@/app/context/app-context";
import { useState } from "react";
import Issue from "./Issue";

export default function LessonCanvasBlock({
  text: displayText,
}: {
  text: string | string[];
}) {
  const [showNote, setShowNote] = useState(false);
  const {
    topic,
    subtopic,
    currentLesson: blockContent,
    lessonStreamCompleted,
  } = useAppState();
  return (
    <div
      className={`bg-slate-100 text-slate-900 px-5 py-5 rounded-lg shadow-sm shadow-slate-200 max-w-4xl w-full`}
    >
      <header className="font-medium text-slate-900 text-center border-b border-solid border-slate-700 pb-2">
        <h1 className="text-3xl">{subtopic}</h1>
        <p className=" text-lg  text-slate-600">Chapter: {topic}</p>
      </header>
      <p className="leading-7 text-lg pt-8 py-5 whitespace-pre-wrap">
        {displayText}
      </p>
      {lessonStreamCompleted && (
        <p
          className="text-emerald-600 cursor-pointer underline underline-offset-2 ml-auto text-center font-semibold"
          onMouseEnter={() => setShowNote(true)}
          onMouseLeave={() => setShowNote(false)}
        >
          Facing Issues?
        </p>
      )}
      {showNote && <Issue />}
    </div>
  );
}
