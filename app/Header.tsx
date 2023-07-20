"use client";
import Link from "next/link";
import { downloadZip } from "@/app/utils/downloadZip";
import { usePathname } from "next/navigation";
import { useAtom } from "jotai";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  currentQuestionAtom,
  worksheetAnswerKeyAtom,
  savedQuestionsAtom,
} from "./atoms/worksheet";
import {
  lessonIdeasAtom,
  contentStreamCompletedAtom,
  teachingAidsAtom,
} from "./atoms/lesson";
import { startedAtom } from "./atoms/app";
import useDownloadContent from "./magic/hooks/useDownloadContent";
import { useRouter } from "next/navigation";
import { getWorksheetDocx } from "./utils/getWorksheetDocx";
import { generateAnswerKeyDocx } from "./utils/generateAnswerKeyDocx";
import { topicAtom } from "./atoms/preferences";
export default function Header() {
  const { data: session, status: sessionStatus } = useSession();
  const [topic] = useAtom(topicAtom);
  const [worksheetAnswerKey] = useAtom(worksheetAnswerKeyAtom);
  const [lessonIdeas] = useAtom(lessonIdeasAtom);
  const [currentQuestion] = useAtom(currentQuestionAtom);
  const [_, setWorksheetAnswerKey] = useAtom(worksheetAnswerKeyAtom);
  const [contentStreamCompleted, setContentStreamCompleted] = useAtom(
    contentStreamCompletedAtom
  );
  const [started] = useAtom(startedAtom);
  const pathname = usePathname();
  const [teachingAids, setTeachingAids] = useAtom(teachingAidsAtom);
  const docxArray = useDownloadContent();
  const router = useRouter();
  const [savedQuestions] = useAtom(savedQuestionsAtom);
  const handleLessonGeneration = () => {
    setTeachingAids([]);
    router.push("/magic/aid/lesson");
  };

  const handleWorksheetGeneration = () => {
    setWorksheetAnswerKey([]);
    router.push("/raptor/magic/worksheet");
  };

  return (
    <header className="sticky top-0 z-50  text-slate-200 pt-4 pl-4 pr-6 pb-1 bg-slate-900">
      <div className="flex items-center justify-between">
        <Link href={`${session ? "/preferences" : "/"}`}>
          <div className={`flex gap-2`}>
            <div
              className={`${!contentStreamCompleted && "animate-breath"}
            `}
            >
              <Image
                src={"/chubbi.png"}
                height={35}
                width={35}
                alt="Falcon Logo"
              />
            </div>
            <div>
              <h1 className="text-sm">FalconAI</h1>
              <p className="text-xs  text-slate-400">
                {session
                  ? `${session?.user?.name?.split(" ")[0]}'s Assistant`
                  : `Teaching Assistant`}
              </p>
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-6">
          {started && lessonIdeas.length !== 0 && pathname === "/merlin" && (
            <button
              className="btn btn-primary btn-sm"
              onClick={handleLessonGeneration}
              key={pathname} //rerenders the component when the path changes
            >
              Generate Lesson
            </button>
          )}
          {currentQuestion.bloomLevel.length > 0 && pathname === "/raptor" && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleWorksheetGeneration}
              key={pathname} //rerenders the component when the path changes
            >
              Generate Worksheet
            </button>
          )}
          {contentStreamCompleted &&
            lessonIdeas.length !== 0 &&
            /^\/magic\/.*$/.test(pathname) && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setTeachingAids([]);
                  router.push("/merlin");
                }}
              >
                Back to Planner
              </button>
            )}

          {contentStreamCompleted &&
            lessonIdeas.length !== 0 &&
            /^\/magic\/.*$/.test(pathname) && (
              <button
                onClick={() => {
                  downloadZip(docxArray);
                }}
                className="btn btn-accent btn-sm"
              >
                Download
              </button>
            )}
          {contentStreamCompleted && /^\/raptor\/magic\/.*$/.test(pathname) && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                setTeachingAids([]);
                router.push("/raptor");
              }}
            >
              Back to Planner
            </button>
          )}
          {contentStreamCompleted && /^\/raptor\/magic\/.*$/.test(pathname) && (
            <button
              onClick={() => {
                savedQuestions.length > 0 && getWorksheetDocx(savedQuestions);
                savedQuestions.length > 0 &&
                  worksheetAnswerKey.length > 0 &&
                  generateAnswerKeyDocx({
                    topic,
                    title: "Answer Key",
                    fetchedContent: worksheetAnswerKey as string[],
                  });
              }}
              className="btn btn-accent btn-sm"
            >
              Download
            </button>
          )}
          {contentStreamCompleted &&
            lessonIdeas.length !== 0 &&
            pathname === "/lesson" && (
              <Link
                className="btn btn-primary btn-sm"
                href={"/preferences"}
                key={pathname} //rerenders the component when the path changes
              >
                New Lesson
              </Link>
            )}
        </div>
      </div>
    </header>
  );
}
