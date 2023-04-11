"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { generateDocx } from "@/app/utils/generateDocx";
import { useAtom } from "jotai";
import {
  boardAtom,
  topicAtom,
  subtopicAtom,
  gradeAtom,
} from "./atoms/preferences";
import {
  currentLessonAtom,
  lessonToDownloadAtom,
  lessonStreamCompletedAtom,
} from "./atoms/lesson";
import { startedAtom } from "./atoms/app";
export default function Header() {
  const [board] = useAtom(boardAtom);
  const [grade] = useAtom(gradeAtom);
  const [topic] = useAtom(topicAtom);
  const [subtopic] = useAtom(subtopicAtom);
  const [currentLesson] = useAtom(currentLessonAtom);
  const [lessonToDownload] = useAtom(lessonToDownloadAtom);
  const [lessonStreamCompleted] = useAtom(lessonStreamCompletedAtom);
  const [started] = useAtom(startedAtom);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-solid border-slate-700 text-slate-200 py-3 pl-4 pr-6 bg-slate-900">
      <div className="flex items-center justify-between">
        <Link href="/">
          <div>
            <h1 className="text-xl">Falcon</h1>
            <p className="text-sm  text-slate-600">AI Co-Teacher</p>
          </div>
        </Link>
        <div className="flex items-center gap-6">
          {grade && (
            <span className="text-base ml-2 font-semibold">{`${board}, Grade ${grade}`}</span>
          )}
          {started && currentLesson.length !== 0 && pathname === "/merlin" && (
            <Link
              href={"/lesson"}
              key={pathname} //rerenders the component when the path changes
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded"
            >
              Generate Lesson
            </Link>
          )}
          {lessonStreamCompleted &&
            currentLesson.length !== 0 &&
            pathname === "/lesson" && (
              <button
                onClick={() =>
                  generateDocx({ topic, subtopic, lessonToDownload })
                }
                className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-medium py-2 px-4 rounded"
              >
                Download Lesson
              </button>
            )}
          {lessonStreamCompleted &&
            currentLesson.length !== 0 &&
            pathname === "/lesson" && (
              <Link
                href={"/preferences"}
                key={pathname} //rerenders the component when the path changes
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded"
              >
                New Lesson
              </Link>
            )}
        </div>
      </div>
    </header>
  );
}
