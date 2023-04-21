"use client";
import gradeData from "../data/subjects.json";

import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import {
  boardAtom,
  topicAtom,
  subjectAtom,
  subtopicAtom,
  gradeAtom,
} from "../atoms/preferences";
import { lessonIdeasAtom } from "../atoms/lesson";
import { startedAtom } from "../atoms/app";

export default function Home() {
  const boards = ["CBSE", "ICSE"];
  const router = useRouter();
  const [board, setBoard] = useAtom(boardAtom);
  const [topic, setTopic] = useAtom(topicAtom);
  const [subtopic, setSubtopic] = useAtom(subtopicAtom);
  const [subject, setSubject] = useAtom(subjectAtom);
  const [grade, setGrade] = useAtom(gradeAtom);
  const [lessonIdeas, setLessonIdeas] = useAtom(lessonIdeasAtom);
  const [started, setStarted] = useAtom(startedAtom);

  const handleBoardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBoard(e.target.value);
  };
  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGrade(e.target.value);
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSubject(e.target.value);
  };

  const handleStart = () => {
    router.push("/merlin");
    setStarted(true);
    setLessonIdeas([]);
  };

  return (
    <div className="flex flex-col gap-4 items-center m-4">
      <select
        onChange={handleBoardChange}
        value={board}
        className="border-slate-700 rounded-md bg-slate-300 text-black p-4 w-96"
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
        className="border-slate-700 rounded-md bg-slate-300 text-black p-4 w-96"
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
        className="border-slate-700 rounded-md bg-slate-300 text-black p-4 w-96"
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

      <div className="flex flex-row gap-4">
        <button
          className="bg-blue-500 ring-1 ring-slate-700 text-slate-700 rounded-md px-8 py-2 text-lg font-medium capitalize disabled:opacity-50"
          onClick={() => router.push(`/predict/topic/${subject}`)}
          disabled={!board || !subject || !grade}
        >
          Predict
        </button>
        <button
          className="bg-emerald-400 ring-1 ring-slate-700 text-slate-700 rounded-md px-8 py-2 text-lg font-medium capitalize disabled:opacity-50"
          onClick={handleStart}
          disabled={!topic || !subtopic || !grade}
        >
          New Lesson
        </button>
      </div>
    </div>
  );
}
