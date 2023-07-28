"use client";
import { useAtom } from "jotai";
import { lessonIdeasAtom } from "@/atoms/lesson";
import ideasToHandouts from "@/utils/ideasToHandouts";
import {
  topicAtom,
  subtopicAtom,
  boardAtom,
  gradeAtom,
  subjectAtom,
} from "@/atoms/preferences";
import Header from "@/components/Header";

export default function Page({
  params,
}: {
  params: { handout: "story" | "activity" | "quiz" };
}) {
  const [topic] = useAtom(topicAtom);
  const [subtopic] = useAtom(subtopicAtom);
  const [board] = useAtom(boardAtom);
  const [grade] = useAtom(gradeAtom);
  const [subject] = useAtom(subjectAtom);
  const [lessonIdeas] = useAtom(lessonIdeasAtom);
  const handouts = ideasToHandouts(lessonIdeas);
  const filteredHandouts = handouts.filter(
    (handout) => handout.aid === params.handout
  );

  return (
    <div className="flex flex-col gap-2 col-start-3 col-span-8 scroll-smooth overflow-y-scroll custom-scrollbar">
      {filteredHandouts.map((aid) => (
        <div
          key={aid.id}
          className={`bg-slate-100 text-slate-900 px-8 py-5 rounded-lg shadow-sm shadow-slate-200 max-w-4xl w-full`}
        >
          <h1 className="text-sm capitalize text-center">{params.handout}</h1>
          <p className="leading-5 text-xs pt-8 py-5 whitespace-pre-wrap">
            {aid.content}
          </p>
        </div>
      ))}
    </div>
  );
}
