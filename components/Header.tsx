"use client";
import { useAppState } from "@/app/context/app-context";
import Link from "next/link";

export default function Header() {
  const { grade, started, currentLesson } = useAppState();

  return (
    <header className="border-b border-solid border-slate-700 text-slate-200 py-3 pl-4 pr-6">
      <div className="flex items-center justify-between">
        <Link href="/">
          <div>
            <h1 className="text-xl">Falcon One</h1>
            <p className="text-sm  text-slate-600">Your Teaching Assistant</p>
          </div>
        </Link>
        <div className="flex items-center gap-6">
          {grade && (
            <span className="text-base ml-2 font-semibold">{`NCERT, Grade ${grade}`}</span>
          )}
          {started && currentLesson.length !== 0 && (
            <Link
              href={"/lesson"}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded"
            >
              Generate Lesson
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
