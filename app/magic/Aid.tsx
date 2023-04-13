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
import AidHeader from "./AidHeader";
import { useContentStream } from "./useContentStream";
import { lessonToDownloadAtom } from "../atoms/lesson";
import { useAtom } from "jotai";
import { visibleAidAtom } from "../atoms/lesson";


export default function Aid() {
  const { contentStream, lessonStreamCompleted } = useContentStream();
  const [lessonToDownload, setLessonToDownload] = useAtom(lessonToDownloadAtom);
  const [visibleAid] = useAtom(visibleAidAtom);

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
