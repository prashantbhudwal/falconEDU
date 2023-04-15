"use client";
import HandoutHeader from "../../components/HandoutHeader";
import { useAtom } from "jotai";
import { lessonIdeasAtom } from "@/app/atoms/lesson";
import ideasToHandouts from "@/app/utils/ideasToHandouts";

export default function Page({
  params,
}: {
  params: { handout: "story" | "activity" | "quiz" };
}) {
  const [lessonIdeas] = useAtom(lessonIdeasAtom);
  const handouts = ideasToHandouts(lessonIdeas);
  const filteredHandouts = handouts.filter(
    (handout) => handout.aid === params.handout
  );

  return (
    <div>
      <HandoutHeader />
      {filteredHandouts.map((aid) => (
        <div
          key={aid.id}
          className={`bg-slate-100 text-slate-900 px-8 py-5 rounded-lg shadow-sm shadow-slate-200 max-w-4xl w-full`}
        >
          <h1 className="text-3xl capitalize text-center">{params.handout}</h1>
          <p className="leading-7 text-lg pt-8 py-5 whitespace-pre-wrap">
            {aid.content}
          </p>
        </div>
      ))}
    </div>
  );
}
