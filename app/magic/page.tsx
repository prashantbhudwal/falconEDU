"use client";
type Aid = {
  id: string;
  isHandout: boolean;
  name:
    | "lessonOutline"
    | "lessonPlan"
    | "slides"
    | "story"
    | "assessment"
    | "activity";
  content: string | string[];
};
import AidHeader from "./components/AidHeader";
import { useContentStream } from "./useContentStream";
import { lessonToDownloadAtom, lessonIdeasAtom } from "../atoms/lesson";
import { useAtom } from "jotai";
import { visibleAidAtom } from "../atoms/lesson";
import { useState, useEffect } from "react";
import { BlockContent } from "@/types";
import { StreamPayload } from "@/types";
import { topicAtom, subtopicAtom, gradeAtom } from "@/app/atoms/preferences";

export default function Aid() {
  const [topic] = useAtom(topicAtom);
  const [subtopic] = useAtom(subtopicAtom);
  const [grade] = useAtom(gradeAtom);

  const [lessonIdeas] = useAtom(lessonIdeasAtom);
  const [fetchNow, setFetchNow] = useState(false);
  const [lessonToDownload, setLessonToDownload] = useAtom(lessonToDownloadAtom);
  const [visibleAid] = useAtom(visibleAidAtom);
  const [payload, setPayload] = useState<StreamPayload>({
    topic: "",
    subtopic: "",
    grade: "",
    ideaArray: [],
  });

  useEffect(() => {
    if (visibleAid === "lesson") {
      setFetchNow(true);
      setPayload({ topic, subtopic, grade, ideaArray: lessonIdeas });
    } else {
      setFetchNow(false);
    }
  }, [visibleAid, lessonIdeas, grade, topic, subtopic]);

  const { contentStream, lessonStreamCompleted } = useContentStream(
    fetchNow,
    payload
  );

  return (
    <div
      className={`bg-slate-100 text-slate-900 px-8 py-5 rounded-lg shadow-sm shadow-slate-200 max-w-4xl w-full`}
    >
      <AidHeader />
      <p className="leading-7 text-lg pt-8 py-5 whitespace-pre-wrap">
        {lessonStreamCompleted ? lessonToDownload : contentStream}
      </p>
    </div>
  );
}
