"use client";
import { useAid } from "@/app/hooks/useAid";
import AidHeader from "./components/AidHeader";

export default function Aid() {
  const aidType = "lesson"; // Change this to "outline" for the outline aid
  const { content } = useAid(aidType);

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
