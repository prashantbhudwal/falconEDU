"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateDocx } from "@/app/utils/generateDocx";
import { useAtom } from "jotai";
import Image from "next/image";
import { topicAtom, subtopicAtom } from "./atoms/preferences";
import {
  lessonIdeasAtom,
  fetchedContentAtom,
  contentStreamCompletedAtom,
  teachingAidsAtom,
} from "./atoms/lesson";
import { startedAtom } from "./atoms/app";
export default function Header() {
  const [topic] = useAtom(topicAtom);
  const [subtopic] = useAtom(subtopicAtom);
  const [lessonIdeas] = useAtom(lessonIdeasAtom);
  const [fetchedContent] = useAtom(fetchedContentAtom);
  const [contentStreamCompleted] = useAtom(contentStreamCompletedAtom);
  const [started] = useAtom(startedAtom);
  const pathname = usePathname();
  const [teachingAids] = useAtom(teachingAidsAtom);

  return (
    <header className="sticky top-0 z-50  text-slate-200 pt-5 pl-4 pr-6 bg-slate-900">
      <div className="flex items-center justify-between">
        <Link href="/">
          <div className="flex gap-4">
            <div>
              <Image
                src={"/chubbi.png"}
                height={45}
                width={45}
                alt="Falcon Logo"
              />
            </div>
            <div>
              <h1 className="text-xl">Falcon</h1>
              <p className="text-sm  text-slate-400">AI Co-Teacher</p>
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-6">
          {started && lessonIdeas.length !== 0 && pathname === "/merlin" && (
            <Link
              href={"/magic/aid/lesson"}
              key={pathname} //rerenders the component when the path changes
              className="bg-emerald-600 hover:bg-emerald-700 text-slate-200 font-medium py-2 px-4 rounded"
            >
              Generate Lesson
            </Link>
          )}
          {contentStreamCompleted &&
            lessonIdeas.length !== 0 &&
            /^\/magic\/.*$/.test(pathname) && (
              <button
                onClick={() => {
                  generateDocx({ topic, subtopic, fetchedContent });
                  console.log(teachingAids);
                }}
                className="bg-purple-600 hover:bg-purple-700 text-slate-100 font-medium py-2 px-4 rounded"
              >
                Download
              </button>
            )}
          {contentStreamCompleted &&
            lessonIdeas.length !== 0 &&
            pathname === "/lesson" && (
              <Link
                href={"/preferences"}
                key={pathname} //rerenders the component when the path changes
                className="bg-emerald-600 hover:bg-emerald-700 text-slate-200 font-medium py-2 px-4 rounded"
              >
                New Lesson
              </Link>
            )}
        </div>
      </div>
    </header>
  );
}
