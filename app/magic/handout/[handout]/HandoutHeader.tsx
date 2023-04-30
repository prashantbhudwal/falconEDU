"use client";
import {
  topicAtom,
  subtopicAtom,
  boardAtom,
  gradeAtom,
  subjectAtom,
} from "@/app/atoms/preferences";
import { useAtom } from "jotai";

export default function HandoutHeader() {
  const [topic] = useAtom(topicAtom);
  const [subtopic] = useAtom(subtopicAtom);
  const [board] = useAtom(boardAtom);
  const [grade] = useAtom(gradeAtom);
  const [subject] = useAtom(subjectAtom);
  return (
    <header className="font-medium text-emerald-500 border-b border-solid border-emerald-700 pb-2 flex flex-row justify-between w-full items-center mb-2">
      <div className="text-sm text-left text-emerald-600">
        {`Grade ${grade}`}
        <p className="text-sm w-10">{subject}</p>{" "}
      </div>
      <div className="text-center">
        <h1 className="text-3xl">{subtopic}</h1>
        <p className=" text-lg  text-slate-600">{topic}</p>
      </div>
      <div className="text-sm text-left text-emerald-600">{board}</div>
    </header>
  );
}
