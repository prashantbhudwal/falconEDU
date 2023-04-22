"use client";
import gradeData from "../data/subjects.json";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { boardAtom, subjectAtom, gradeAtom } from "../atoms/preferences";
import useDesktop from "../hooks/useDesktop";
import DesktopOnly from "../components/DesktopOnly";
export default function Home() {
  const boards = ["CBSE", "ICSE"];
  const router = useRouter();
  const [board, setBoard] = useAtom(boardAtom);
  const [subject, setSubject] = useAtom(subjectAtom);
  const [grade, setGrade] = useAtom(gradeAtom);

  const isDesktop = useDesktop();
  if (!isDesktop) {
    return <DesktopOnly />;
  }

  const handleBoardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBoard(e.target.value);
  };
  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGrade(e.target.value);
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSubject(e.target.value);
  };

  const startPrediction = () => {
    router.push(`/preferences/topic/`);
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
          className="bg-emerald-500 ring-1 ring-slate-700 text-slate-700 rounded-md px-8 py-2 text-lg font-medium capitalize disabled:opacity-50"
          onClick={startPrediction}
          disabled={!board || !subject || !grade}
        >
          Next
        </button>
      </div>
    </div>
  );
}
