"use client";
import { useAid } from "@/app/hooks/useAid";
import AidHeader from "../../components/AidHeader";
import Issue from "@/app/components/Issue";
import { contentStreamCompletedAtom } from "@/app/atoms/lesson";
import { useAtom } from "jotai";
import { useState } from "react";
import useLatestAid from "@/app/hooks/useLatestAid";

export default function Page({
  params,
}: {
  params: { aid: "lesson" | "outline" };
}) {
  const [showNote, setShowNote] = useState(false);
  const [contentStreamCompleted] = useAtom(contentStreamCompletedAtom);
  const { content } = useAid(params.aid);
  const latestAid = useLatestAid(params.aid);
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
    </div>
  );
}
