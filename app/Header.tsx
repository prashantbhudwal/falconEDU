"use client";
import Link from "next/link";
import { useAtom } from "jotai";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { contentStreamCompletedAtom } from "../lib/atoms/lesson";

export default function Header() {
  const { data: session, status: sessionStatus } = useSession();
  const [contentStreamCompleted, setContentStreamCompleted] = useAtom(
    contentStreamCompletedAtom
  );

  return (
    <header className="sticky top-0 z-50  w-full bg-slate-900 pb-1 pl-4 pr-6 pt-4 text-slate-200">
      <div className="flex items-center justify-between">
        <Link href={`${session ? "/preferences" : "/"}`}>
          <div className={`flex gap-2`}>
            <div
              className={`${!contentStreamCompleted && "animate-breath"}
            `}
            >
              <Image
                src={"/chubbi.png"}
                height={35}
                width={35}
                alt="Falcon Logo"
              />
            </div>
            <div>
              <h1 className="text-sm">FalconAI</h1>
              <p className="text-xs  text-slate-400">
                {session
                  ? `${session?.user?.name?.split(" ")[0]}'s Assistant`
                  : `Teaching Assistant`}
              </p>
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-6"></div>
      </div>
    </header>
  );
}
