"use client";
import { useAid } from "@/app/hooks/useAid";
import AidHeader from "./AidHeader";
import Issue from "@/app/components/Issue";
import { contentStreamCompletedAtom } from "@/app/atoms/lesson";
import { useAtom } from "jotai";
import { useState } from "react";
import useLatestAid from "@/app/hooks/useLatestAid";
import { aidType } from "@/types";
import { useEffect } from "react";
import { shouldRegenerateAtom } from "@/app/atoms/lesson";
export default function Page({ params }: { params: { aid: aidType } }) {
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
      <AidHeader />
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
