"use client";
import { getEmoji } from "@/app/utils";
import Link from "next/link";
import { useAtom } from "jotai";
import { contentStreamCompletedAtom } from "@/app/atoms/lesson";
import { handoutType } from "@/types";
import { usePathname } from "next/navigation";

export default function HandoutChip({ aid }: { aid: handoutType }) {
  const [contentStreamCompleted] = useAtom(contentStreamCompletedAtom);
  const pathname = usePathname();

  const linkContent = (
    <button
      className={`text-slate-300 px-3 py-2 rounded-md ${
        contentStreamCompleted
          ? "opacity-100 hover:bg-slate-800 hover:cursor-pointer"
          : "opacity-50 cursor-not-allowed"
      }
      ${pathname === `/magic/handout/${aid}` ? "bg-slate-700" : ""}
      `}
    >
      <p className={`text-lg capitalize`}>{`${getEmoji(aid)} ${aid}`}</p>
    </button>
  );

  return <Link href={`/magic/handout/${aid}`}>{linkContent}</Link>;
}
