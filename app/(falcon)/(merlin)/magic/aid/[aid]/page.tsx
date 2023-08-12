"use client";
import { useAid } from "../../hooks/useAid";
import Issue from "@/components/Issue";
import { useAtom } from "jotai";
import { useState } from "react";
import useLatestAid from "../../hooks/useLatestAid";
import { useEffect } from "react";
import { shouldRegenerateAtom } from "@/atoms/lesson";
import { contentStreamCompletedAtom, teachingAidsAtom } from "@/atoms/lesson";

import { aidType, handoutType } from "@/types";
import { Message } from "../../../merlin/components/Message";
import useRedirectHome from "@/hooks/useRedirectHome";
import useTrackPage from "@/hooks/analytics/useTrackPage";
export default function Page({ params }: { params: { aid: aidType } }) {
  useRedirectHome();
  useTrackPage(`Magic - ${params.aid}`);
  const { content, startStreaming, isLoading } = useAid(params.aid);
  const latestAid = useLatestAid(params.aid);
  useEffect(() => {
    startStreaming();
  }, []);

  return (
    <div
      className={`custom-scrollbar col-span-8 col-start-3 mt-0 flex h-full flex-col items-center gap-4 overflow-y-scroll scroll-smooth bg-slate-950 px-6 py-4 pb-96 text-slate-800 shadow-md marker:h-full`}
    >
      {isLoading ? (
        <Message message={content} />
      ) : (
        <Message message={latestAid} />
      )}
    </div>
  );
}
