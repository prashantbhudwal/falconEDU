"use client";
type Aid = {
  id: string;
  isHandout: boolean;
  name:
    | "lessonOutline"
    | "lessonPlan"
    | "slides"
    | "story"
    | "assessment"
    | "activity";
  content: string | string[];
};
import AidHeader from "./AidHeader";
export default function AidBlock({
  content,
}: {
  content: string | string[];
}) {
  return (
    <div
      className={`bg-slate-100 text-slate-900 px-8 py-5 rounded-lg shadow-sm shadow-slate-200 max-w-4xl w-full`}
    >
      <AidHeader />
      <p className="leading-7 text-lg pt-8 py-5 whitespace-pre-wrap">
        {content}
      </p>
    </div>
  );
}
