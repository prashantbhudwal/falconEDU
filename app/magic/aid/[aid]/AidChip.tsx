"use client";
import { getEmoji, getName } from "@/app/utils";
import Link from "next/link";
import { useAtom } from "jotai";
import { contentStreamCompletedAtom } from "@/app/atoms/lesson";
import { aidType } from "@/types/ideaTypes";
import { usePathname } from "next/navigation";

export default function AidChip({ aid }: { aid: aidType }) {
  const [contentStreamCompleted] = useAtom(contentStreamCompletedAtom);
  const pathname = usePathname();

  const linkContent = (
    <div
      className={`text-slate-300 px-3 py-2 rounded-md ${
        contentStreamCompleted
          ? "opacity-100 hover:bg-slate-800 hover:cursor-pointer"
          : "opacity-50 cursor-not-allowed"
      }
      ${pathname === `/magic/aid/${aid}` ? "bg-slate-700" : ""}
      `}
    >
      <p className={`capitalize `}>{`${getEmoji(aid)} ${getName(aid)}`}</p>
    </div>
  );
  return <Link href={`/magic/aid/${aid}`}>{linkContent}</Link>;
}
