"use client";
import { getEmoji } from "../../utils";
import Link from "next/link";
import { useAtom } from "jotai";
import { contentStreamCompletedAtom } from "@/app/atoms/lesson";

export default function AidChip({ aid }: { aid: string }) {
  const [contentStreamCompleted] = useAtom(contentStreamCompletedAtom);

  const linkContent = (
    <div
      className={`text-slate-300 px-3 py-2 rounded-md ${
        contentStreamCompleted
          ? "opacity-100 hover:bg-slate-800 hover:cursor-pointer"
          : "opacity-50 cursor-not-allowed"
      }`}
    >
      <p className={`text-lg capitalize`}>{`${getEmoji(aid)} ${aid}`}</p>
    </div>
  );

  return contentStreamCompleted ? (
    <Link href={`/magic/${aid}`}>{linkContent}</Link>
  ) : (
    <>{linkContent}</>
  );
}
