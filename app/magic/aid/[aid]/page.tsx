"use client";
import { useAid } from "../../hooks/useAid";
import Issue from "@/components/Issue";
import { contentStreamCompletedAtom } from "@/atoms/lesson";
import { useAtom } from "jotai";
import { useState } from "react";
import useLatestAid from "../../hooks/useLatestAid";
import { aidType } from "@/types";
import { useEffect } from "react";
import { shouldRegenerateAtom } from "@/atoms/lesson";
import {
  topicAtom,
  subtopicAtom,
  boardAtom,
  gradeAtom,
  subjectAtom,
} from "@/atoms/preferences";
import Header from "@/components/Header";
export default function Page({ params }: { params: { aid: aidType } }) {
  const [topic] = useAtom(topicAtom);
  const [subtopic] = useAtom(subtopicAtom);
  const [board] = useAtom(boardAtom);
  const [grade] = useAtom(gradeAtom);
  const [subject] = useAtom(subjectAtom);
  const [showNote, setShowNote] = useState(false);
  const [contentStreamCompleted] = useAtom(contentStreamCompletedAtom);
  const { content, startStreaming } = useAid(params.aid);
  // console.log(params.aid);
  const latestAid = useLatestAid(params.aid);
  // console.log(latestAid);
  const [shouldRegenerate, setShouldRegenerate] = useAtom(shouldRegenerateAtom);

  useEffect(() => {
    startStreaming();
  }, []);
  useEffect(() => {
    if (shouldRegenerate) {
      startStreaming();
    }
  }, [shouldRegenerate]);

  return (
    <div
      className={`bg-slate-100 text-slate-900 px-8 py-5 rounded-lg shadow-sm shadow-slate-200 max-w-4xl w-full`}
    >
      <Header
        leftTop={`Grade ${grade}`}
        leftBottom={subject}
        rightTop={board}
        heading={subtopic}
        subheading={topic}
        color={"white"}
      />
      <p className="leading-7 text-lg pt-8 py-5 whitespace-pre-wrap">
        {contentStreamCompleted ? latestAid : content}
      </p>
      {contentStreamCompleted && (
        <p
          className="text-emerald-600 cursor-pointer underline underline-offset-2 ml-auto text-center font-semibold"
          onMouseEnter={() => setShowNote(true)}
          onMouseLeave={() => setShowNote(false)}
        >
          Facing Issues?
        </p>
      )}
      {showNote && <Issue />}
      {/* <button
        onClick={() => setShouldRegenerate(true)}
        className={`text-green-500`}
      >
        Regenerate
      </button> */}
    </div>
  );
}
