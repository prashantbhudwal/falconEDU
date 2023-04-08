"use client";
import { useAppState } from "@/app/context/app-context";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
export default function Header() {
  const { grade, started, board, currentLesson } = useAppState();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="border-b border-solid border-slate-700 text-slate-200 py-3 pl-4 pr-6">
      <div className="flex items-center justify-between">
        <Link href="/">
          <div>
            <h1 className="text-xl">Falcon</h1>
            <p className="text-sm  text-slate-600">AI Co-Teacher</p>
          </div>
        </Link>
        <div className="flex items-center gap-6">
          {grade && (
            <span className="text-base ml-2 font-semibold">{`${board}, Grade ${grade}`}</span>
          )}
          {started && currentLesson.length !== 0 && pathname === "/merlin" && (
            <Link
              href={"/lesson"}
              key={pathname} //rerenders the component when the path changes
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded"
            >
              Generate Lesson
            </Link>
          )}
          {started && currentLesson.length !== 0 && pathname === "/lesson" && (
            <Link
              href={"/preferences"}
              key={pathname} //rerenders the component when the path changes
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded"
            >
              New Lesson
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
