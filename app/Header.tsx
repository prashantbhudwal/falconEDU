"use client";
import Link from "next/link";
import { downloadZip } from "@/app/utils/downloadZip";
import { usePathname } from "next/navigation";
import LinkButton from "@/app/components/LinkButton";
import Button from "@/app/components/Button";
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

export default function Header() {
  const { data: session, status: sessionStatus } = useSession();
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
    <header className="sticky top-0 z-50  text-slate-200 pt-5 pl-4 pr-6 pb-2 bg-slate-900">
      <div className="flex items-center justify-between">
        <Link href="/">
          <div className={`flex gap-4`}>
            <div
              className={`${!contentStreamCompleted && "animate-breath"}
            `}
            >
              <Image
                src={"/chubbi.png"}
                height={45}
                width={45}
                alt="Falcon Logo"
              />
            </div>
            <div>
              <h1 className="text-lg">FalconAI</h1>
              <p className="text-sm  text-slate-400">
                {session
                  ? `${session?.user?.name?.split(" ")[0]}'s Assistant`
                  : `Teaching Assistant`}
              </p>
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-6">
          {started && lessonIdeas.length !== 0 && pathname === "/merlin" && (
            <Button
              onClick={handleLessonGeneration}
              key={pathname} //rerenders the component when the path changes
            >
              Generate Lesson
            </Button>
          )}
          {currentQuestion.bloomLevel.length > 0 && pathname === "/raptor" && (
            <Button
              onClick={handleWorksheetGeneration}
              key={pathname} //rerenders the component when the path changes
            >
              Generate Worksheet
            </Button>
          )}
          {contentStreamCompleted &&
            lessonIdeas.length !== 0 &&
            /^\/magic\/.*$/.test(pathname) && (
              <Button
                onClick={() => {
                  setTeachingAids([]);
                  router.push("/merlin");
                }}
              >
                Back to Planner
              </Button>
            )}

          {contentStreamCompleted &&
            lessonIdeas.length !== 0 &&
            /^\/magic\/.*$/.test(pathname) && (
              <button
                onClick={() => {
                  downloadZip(docxArray);
                }}
                className="bg-purple-600 hover:bg-purple-700 text-slate-100 font-medium py-2 px-4 rounded"
              >
                Download
              </button>
            )}
          {contentStreamCompleted && /^\/raptor\/magic\/.*$/.test(pathname) && (
            <Button
              onClick={() => {
                setTeachingAids([]);
                router.push("/raptor");
              }}
            >
              Back to Planner
            </Button>
          )}
          {contentStreamCompleted && /^\/raptor\/magic\/.*$/.test(pathname) && (
            <button
              onClick={() => {
                savedQuestions.length > 0 && getWorksheetDocx(savedQuestions);
                savedQuestions.length > 0 && getWorksheetDocx(savedQuestions);
              }}
              className="bg-purple-600 hover:bg-purple-700 text-slate-100 font-medium py-2 px-4 rounded"
            >
              Download
            </button>
          )}
          {contentStreamCompleted &&
            lessonIdeas.length !== 0 &&
            pathname === "/lesson" && (
              <LinkButton
                href={"/preferences"}
                key={pathname} //rerenders the component when the path changes
              >
                New Lesson
              </LinkButton>
            )}
        </div>
      </div>
    </header>
  );
}
