"use client";
import { usePrediction } from "@/app/hooks/usePrediction";
import { contentStreamCompletedAtom } from "@/app/atoms/lesson";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { shouldRegenerateAtom } from "@/app/atoms/lesson";
export default function Page({ params }: { params: { node: string } }) {
  const [contentStreamCompleted] = useAtom(contentStreamCompletedAtom);
  const { content, startStreaming } = usePrediction(params.node);
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
      <p className="leading-7 text-lg pt-8 py-5 whitespace-pre-wrap">
        {content}
      </p>
      {/* <button
        onClick={() => setShouldRegenerate(true)}
        className={`text-green-500`}
      >
        Regenerate
      </button> */}
    </div>
  );
}
