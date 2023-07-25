"use client";
import { useAid } from "../../hooks/useAid";
import Issue from "@/components/Issue";
import { useAtom } from "jotai";
import { useState } from "react";
import useLatestAid from "../../hooks/useLatestAid";
import { useEffect } from "react";
import { shouldRegenerateAtom } from "@/atoms/lesson";
import {
  topicAtom,
  subtopicAtom,
  boardAtom,
  gradeAtom,
  subjectAtom,
} from "@/atoms/preferences";

import { contentStreamCompletedAtom, teachingAidsAtom } from "@/atoms/lesson";

import { aidType, handoutType } from "@/types";


export default function Page({ params }: { params: { aid: aidType } }) {
  const [topic] = useAtom(topicAtom);
  const [subtopic] = useAtom(subtopicAtom);
  const [board] = useAtom(boardAtom);
  const [grade] = useAtom(gradeAtom);
  const [subject] = useAtom(subjectAtom);
  const [showNote, setShowNote] = useState(false);
  const { content, startStreaming } = useAid(params.aid);
  const latestAid = useLatestAid(params.aid);
  const [shouldRegenerate, setShouldRegenerate] = useAtom(shouldRegenerateAtom);
  const [contentStreamCompleted, setContentStreamCompleted] = useAtom(
    contentStreamCompletedAtom
  );

  

  //TODO Uncomment this
  // useEffect(() => {
  //   if (topic === "" || subtopic === "") {
  //     router.push("/preferences");
  //   }
  // }, [topic, subtopic, router]);

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
      className={`col-start-3 col-span-8 leading-7 text-lg whitespace-pre-wrap mt-0 h-full shadow-md bg-slate-200 py-4 flex flex-col items-center gap-4 text-slate-800 px-6 pb-96 marker:h-full scroll-smooth overflow-y-scroll custom-scrollbar`}
    >
      <p>{contentStreamCompleted ? latestAid : content}</p>
    </div>
  );
}

// {/* {contentStreamCompleted && (
//             <p
//               className="text-emerald-600 cursor-pointer underline underline-offset-2 ml-auto text-center font-semibold"
//               onMouseEnter={() => setShowNote(true)}
//               onMouseLeave={() => setShowNote(false)}
//             >
//               Facing Issues?
//             </p>
//           )}
//           {showNote && <Issue />} */}
