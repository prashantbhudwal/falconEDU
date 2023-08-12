"use client";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
export default function Footer() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  return (
    <footer className="grid grid-cols-1 gap-12 border-t border-slate-700 py-6 pl-12 text-center md:grid-cols-3">
      <div className="flex flex-col items-start gap-3">
        <h2 className="mb-2 text-lg font-bold">FalconAI</h2>
        <Link
          href="https://falconai.in"
          className="block underline underline-offset-4 hover:text-slate-500"
        >
          Website
        </Link>
        <Link
          href="https://www.linkedin.com/company/falconassistant/"
          className="block underline underline-offset-4 hover:text-slate-500"
        >
          LinkedIn
        </Link>
      </div>
      <div className="flex flex-col items-start gap-3">
        <h2 className="mb-2 text-lg font-bold">Help</h2>
        <Link
          href="https://www.youtube.com/watch?v=Rh9pBJRJ0zI"
          className="block underline underline-offset-4 hover:text-slate-500"
        >
          Watch the demo
        </Link>
        <div>9833045490</div>
      </div>
      {session && sessionStatus === "authenticated" && (
        <div className="flex flex-col items-start gap-3">
          <h2 className="mb-2 text-lg font-bold">Account</h2>

          <button
            onClick={() => router.push("/preferences")}
            className="block underline underline-offset-4 hover:text-slate-500"
          >
            Lesson Settings
          </button>
          <button
            onClick={() => router.push("/profile")}
            className="block underline underline-offset-4 hover:text-slate-500"
          >
            Profile
          </button>
          <button
            onClick={() => signOut()}
            className="mb-2 block underline underline-offset-4 hover:text-slate-500"
          >
            Sign Out
          </button>
        </div>
      )}
    </footer>
  );
}
