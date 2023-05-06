"use client";
import { getEmoji } from "@/app/utils";
import Link from "next/link";
import { useAtom } from "jotai";
import { contentStreamCompletedAtom } from "@/app/atoms/lesson";
import { handoutType } from "@/types";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function HandoutChip({ aid }: { aid: handoutType }) {
  const [contentStreamCompleted] = useAtom(contentStreamCompletedAtom);
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = () => {
    if (contentStreamCompleted) {
      router.push(`/magic/handout/${aid}`);
    }
  };
  return (
    <button
      onClick={handleClick}
      className={`text-slate-300 px-3 py-2 rounded-md text-left ${
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
}
