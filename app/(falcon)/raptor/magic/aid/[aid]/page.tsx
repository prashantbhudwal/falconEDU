"use client";
import Issue from "@/components/Issue";
import { contentStreamCompletedAtom } from "@/atoms/lesson";
import { useAtom } from "jotai";
import { useState } from "react";
import { worksheetAidType } from "@/types";
import { useEffect } from "react";
import {
  topicAtom,
  boardAtom,
  gradeAtom,
  subjectAtom,
} from "@/atoms/preferences";
import Header from "@/components/Header";
import { useWorksheetStream } from "@/app/(falcon)/raptor/hooks/useWorksheetStream";
import { worksheetAnswerKeyAtom, savedQuestionsAtom } from "@/atoms/worksheet";
export default function Page({
  params,
}: {
  params: { aid: worksheetAidType };
}) {
  const [topic] = useAtom(topicAtom);
  const [board] = useAtom(boardAtom);
  const [grade] = useAtom(gradeAtom);
  const [subject] = useAtom(subjectAtom);
  const [showNote, setShowNote] = useState(false);
  const [contentStreamCompleted] = useAtom(contentStreamCompletedAtom);
  const { content, startStreaming } = useWorksheetStream("generateAnswers");
  const [savedQuestions] = useAtom(savedQuestionsAtom);
  const [worksheetAnswerKey, setWorksheetAnswerKey] = useAtom(
    worksheetAnswerKeyAtom
  );

  useEffect(() => {
    if (worksheetAnswerKey.length !== 0) return;
    startStreaming();
  }, [savedQuestions]);

  useEffect(() => {
    if (contentStreamCompleted) {
      setWorksheetAnswerKey(content);
    }
  }, [contentStreamCompleted]);

  return (
    <div
      className={`bg-slate-100 text-slate-900 px-8 py-5 rounded-lg shadow-sm shadow-slate-200 max-w-4xl w-full`}
    >
      <Header
        leftTop={`Grade ${grade}`}
        leftBottom={subject}
        rightTop={board}
        heading={topic}
        color={"white"}
      />
      <p className="leading-7 text-lg pt-8 py-5 whitespace-pre-wrap">
        {contentStreamCompleted ? worksheetAnswerKey : content}
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
