"use Client";
import { useRouter } from "next/navigation";
import AidBlock from "./AidBlock";
import { useContentStream } from "./useContentStream";
import { topicAtom, subtopicAtom } from "@/app/atoms/preferences";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { lessonToDownloadAtom } from "../atoms/lesson";

export default function Aid({ className }: { className?: string }) {
  const [lessonToDownload, setLessonToDownload] = useAtom(lessonToDownloadAtom);
  const router = useRouter();
  const [topic] = useAtom(topicAtom);
  const [subtopic] = useAtom(subtopicAtom);
  const { contentStream, lessonStreamCompleted } =
    useContentStream();

  useEffect(() => {
    if (topic === "" || subtopic === "") {
      router.push("/preferences");
    }
  }, [topic, subtopic]);

  return (
    <div
      className={`${className} flex flex-col items-center gap-4 text-slate-300 px-5 py-3 rounded-lg ring-2 ring-emerald-500 shadow-emerald-500 ${"shadow-md bg-slate-900"}`}
    >
      {lessonStreamCompleted ? (
        <AidBlock content={lessonToDownload} />
      ) : (
        <AidBlock content={contentStream} />
      )}
    </div>
  );
}
