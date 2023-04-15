"use client";
import AidHeader from "../../components/AidHeader";
import HandoutHeader from "../../components/HandoutHeader";
import { useAtom } from "jotai";
import { BlockContent } from "@/types";
import { lessonIdeasAtom } from "@/app/atoms/lesson";
type Aid = {
  id: string;
  aid: string;
  content: string | string[];
};
const ideasToAids = (ideas: BlockContent[]): Aid[] => {
  return ideas.map(({ id, type, text }) => ({
    id,
    aid: type,
    content: text,
  }));
};
export default function Page({
  params,
}: {
  params: { handout: "story" | "activity" | "quiz" };
}) {
  const [lessonIdeas] = useAtom(lessonIdeasAtom);
  const aids = ideasToAids(lessonIdeas);
  const newAids = aids.filter((aid) => aid.aid === params.handout);

  return (
    <div>
      <HandoutHeader />
      {newAids.map((aid) => (
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
