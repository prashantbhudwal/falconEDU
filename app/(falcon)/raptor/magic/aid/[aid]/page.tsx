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
      className={`h-full w-full max-w-4xl rounded-lg bg-slate-100 px-8 py-5 text-slate-900 shadow-sm shadow-slate-200`}
    >
      <p className="whitespace-pre-wrap py-5 pt-8 text-lg leading-7">
        {contentStreamCompleted ? worksheetAnswerKey : content}
      </p>
    </div>
  );
}
