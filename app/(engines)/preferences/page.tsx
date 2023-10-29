"use client";
import gradeData from "../../data/subjects.json";
import boards from "../../data/boards.json";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import {
  boardAtom,
  subjectAtom,
  gradeAtom,
} from "../../../lib/atoms/preferences";
import { userFlowAtom } from "../../../lib/atoms/app";

import { useEffect } from "react";
export default function Home() {
  const router = useRouter();
  const [board, setBoard] = useAtom(boardAtom);
  const [subject, setSubject] = useAtom(subjectAtom);
  const [grade, setGrade] = useAtom(gradeAtom);
  const [userFlow, setUserFlow] = useAtom(userFlowAtom);

  useEffect(() => {
    router.prefetch("/preferences/topic");
    if (userFlow === "lesson") {
      router.prefetch("/preferences/subtopic");
      router.prefetch("/merlin");
      router.prefetch("/magic/aid/lesson");
    } else if (userFlow === "worksheet") {
      router.prefetch("/preferences/multipleSubtopics");
      router.prefetch("/raptor");
      router.prefetch("/raptor/magic/worksheet");
      router.prefetch("/raptor/magic/aid/answerKey");
    }
  }, []);

  const handleBoardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBoard(e.target.value);
  };
  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGrade(e.target.value);
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSubject(e.target.value);
  };

  const startLessonFlow = () => {
    setUserFlow("lesson");
    router.push(`/preferences/topic/`);
  };
  const startWorksheetFlow = () => {
    setUserFlow("worksheet");
    router.push(`/preferences/topic/`);
  };

  return (
    <div className="m-4 flex flex-col items-center gap-5">
      <select
        onChange={handleBoardChange}
        value={board}
        className="select select-bordered w-96"
      >
        <option value="">Curriculum</option>
        {boards.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>
      <select
        onChange={handleGradeChange}
        value={grade}
        className="select select-bordered w-96"
      >
        <option value="">Grade</option>
        {gradeData.map((g) => (
          <option key={g.grade} value={g.grade}>
            Grade {g.grade}
          </option>
        ))}
      </select>
      <select
        onChange={handleSubjectChange}
        value={subject}
        className="select select-bordered w-96"
      >
        <option value="">Subject</option>
        {gradeData
          .find((g) => g.grade === grade)
          ?.subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
      </select>
      <div className="join mt-6 max-w-full">
        <button
          onClick={startLessonFlow}
          disabled={!board || !subject || !grade}
          className="btn btn-primary join-item btn-wide"
        >
          Lesson
        </button>
        <button
          className="btn btn-secondary join-item btn-wide"
          onClick={startWorksheetFlow}
          disabled={!board || !subject || !grade}
        >
          Worksheet
        </button>
      </div>
    </div>
  );
}
