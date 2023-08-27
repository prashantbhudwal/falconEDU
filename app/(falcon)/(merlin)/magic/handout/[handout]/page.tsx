"use client";
import { useAtom } from "jotai";
import { lessonIdeasAtom } from "@/atoms/lesson";
import ideasToHandouts from "@/lib/ideasToHandouts";
import useTrackPage from "@/hooks/analytics/useTrackPage";
export default function Page({
  params,
}: {
  params: { handout: "story" | "activity" | "quiz" };
}) {
  useTrackPage(`Magic - ${params.handout}`);
  const [lessonIdeas] = useAtom(lessonIdeasAtom);
  const handouts = ideasToHandouts(lessonIdeas);
  const filteredHandouts = handouts.filter(
    (handout) => handout.aid === params.handout
  );

  return (
    <div className="custom-scrollbar col-span-8 col-start-3 flex flex-col gap-2 overflow-y-scroll scroll-smooth">
      {filteredHandouts.map((aid) => (
        <div
          key={aid.id}
          className={`w-full max-w-4xl rounded-lg bg-slate-100 px-8 py-5 text-slate-900 shadow-sm shadow-slate-200`}
        >
          <h1 className="text-center text-sm capitalize">{params.handout}</h1>
          <p className="whitespace-pre-wrap py-5 pt-8 text-xs leading-5">
            {aid.content}
          </p>
        </div>
      ))}
    </div>
  );
}
