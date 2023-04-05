"use client";
import { useAppState } from "@/app/context/app-context";
import Link from "next/link";

export default function Header() {
  const { grade } = useAppState();

  return (
    <header className="border-b border-solid border-slate-700 text-slate-200 py-3 pl-4 pr-6">
      <div className="flex items-center justify-between">
        <Link href="/">
          <div>
            <h1 className="text-xl">Falcon One</h1>
            <p className="text-sm  text-slate-600">Your Teaching CoPilot</p>
          </div>
        </Link>
        <div className="flex items-center gap-6">
          {grade && (
            <span className="text-base ml-2 font-semibold">{`NCERT, Grade ${grade}`}</span>
          )}
        </div>
      </div>
    </header>
  );
}
