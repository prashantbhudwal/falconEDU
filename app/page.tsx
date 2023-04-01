"use client";
import grades from "./data/grades.json";
import { useAppState } from "./context/app-context";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { topic, subtopic, grade, setTopic, setSubtopic, setGrade } =
    useAppState();

  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGrade(e.target.value);
  };

  const handleChapterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTopic(e.target.value);
  };

  const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSubtopic(e.target.value);
  };

  return (
    <div className="flex flex-col gap-4 items-center m-4">
      <select
        onChange={handleGradeChange}
        value={grade}
        className="border-slate-700 rounded-md bg-slate-300 text-black p-4 w-96"
      >
        <option value="">Select a grade</option>
        {grades.map((g) => (
          <option key={g.id} value={g.grade}>
            Grade {g.grade}
          </option>
        ))}
      </select>
      <select
        onChange={handleChapterChange}
        value={topic}
        className="border-slate-700 rounded-md bg-slate-300 text-black p-4 w-96"
      >
        <option value="">Select a chapter</option>
        {grades
          .find((g) => g.grade === grade)
          ?.chapters.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
      </select>
      <select
        onChange={handleTopicChange}
        value={subtopic}
        className="border-slate-700 rounded-md bg-slate-300 text-black p-4 w-96"
      >
        <option value="">Select a topic</option>
        {grades
          .find((g) => g.grade === grade)
          ?.chapters.find((c) => c.name === topic)
          ?.topics.map((t) => (
            <option key={t.id} value={t.name}>
              {t.name}
            </option>
          ))}
      </select>
      <button
        className="bg-emerald-500 ring-1 ring-slate-700 text-slate-700 rounded-md px-8 py-2 text-lg font-medium capitalize"
        onClick={() => router.push("/chat")}
        disabled={!topic || !subtopic || !grade}
      >
        Start
      </button>
      <button
        className="bg-fuchsia-500 ring-1 ring-slate-700 text-slate-700 rounded-md px-8 py-2 text-lg font-medium capitalize"
        onClick={() => router.push("/merlin")}
        disabled={!topic || !subtopic || !grade}
      >
        Merlin
      </button>
    </div>
  );
}
