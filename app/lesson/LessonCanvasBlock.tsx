"use client";
import { useAppState } from "@/app/context/app-context";

export default function LessonCanvasBlock({
  text: displayText,
}: {
  text: string | string[];
}) {
  const { topic, subtopic, currentLesson: blockContent } = useAppState();
  return (
    <div
      className={`bg-slate-100 text-slate-900 px-5 py-5 rounded-lg shadow-sm shadow-slate-200 max-w-4xl w-full`}
    >
      <header className="font-medium text-slate-900 text-center pb-2">
        <h1 className="text-3xl">{subtopic}</h1>
        <p className=" text-lg  text-slate-600">Chapter: {topic}</p>
      </header>
      <p className="leading-7 text-lg pt-8 py-5 whitespace-pre-wrap">
        {displayText}
      </p>
    </div>
  );
}
