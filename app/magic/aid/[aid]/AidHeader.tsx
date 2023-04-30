"use client";
import {
  topicAtom,
  subtopicAtom,
  boardAtom,
  gradeAtom,
  subjectAtom,
} from "@/app/atoms/preferences";
import { useAtom } from "jotai";

export default function AidHeader() {
  const [topic] = useAtom(topicAtom);
  const [subtopic] = useAtom(subtopicAtom);
  const [board] = useAtom(boardAtom);
  const [grade] = useAtom(gradeAtom);
  const [subject] = useAtom(subjectAtom);
  return (
    <header className="font-medium text-slate-900 text-center border-b border-solid border-slate-700 pb-2 flex flex-row justify-between items-center">
      <div className=" text-slate-500 text-left">
        {`Grade ${grade}`}
        <p className="text-sm w-10">{subject}</p>{" "}
      </div>
      <div>
        <h1 className="text-3xl">{subtopic}</h1>
        <p className=" text-lg  text-slate-600">{topic}</p>
      </div>
      <div className=" text-slate-500">{board}</div>
    </header>
  );
}
