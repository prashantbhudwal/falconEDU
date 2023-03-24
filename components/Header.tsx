"use client";
import { useAppState } from "@/app/context/app-context";

export default function Header() {
  const { grade } = useAppState();

  return (
    <header className="border-b border-solid border-slate-700 text-slate-200 p-4 pr-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl">Falcon One</h1>
          <p className="text-sm  text-slate-600">Your Teaching CoPilot</p>
        </div>
        {grade && (
          <span className="text-base ml-2 font-semibold">{`NCERT, Grade ${grade}`}</span>
        )}
      </div>
    </header>
  );
}
