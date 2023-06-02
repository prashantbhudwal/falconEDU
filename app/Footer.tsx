"use client";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
export default function Footer() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  return (
    <footer className="grid grid-cols-1 md:grid-cols-3 gap-12 py-6 pl-12 border-t border-slate-700 text-center">
      <div className="flex flex-col items-start gap-3">
        <h2 className="font-bold text-lg mb-2">FalconAI</h2>
        <Link
          href="https://falconai.in"
          className="hover:text-slate-500 underline underline-offset-4 block"
        >
          Website
        </Link>
        <Link
          href="https://www.linkedin.com/company/falconassistant/"
          className="hover:text-slate-500 underline underline-offset-4 block"
        >
          LinkedIn
        </Link>
      </div>
      <div className="flex flex-col items-start gap-3">
        <h2 className="font-bold text-lg mb-2">Help</h2>
        <Link
          href="https://www.youtube.com/watch?v=Rh9pBJRJ0zI"
          className="hover:text-slate-500 underline underline-offset-4 block"
        >
          Watch the demo
        </Link>
        <div>Use WhatsApp Group</div>
      </div>
      {session && sessionStatus === "authenticated" && (
        <div className="flex flex-col items-start gap-3">
          <h2 className="font-bold text-lg mb-2">Account</h2>

          <button
            onClick={() => router.push("/preferences")}
            className="hover:text-slate-500 underline underline-offset-4 block"
          >
            Lesson Settings
          </button>
          <button
            onClick={() => router.push("/profile")}
            className="hover:text-slate-500 underline underline-offset-4 block"
          >
            Profile
          </button>
          <button
            onClick={() => signOut()}
            className="hover:text-slate-500 underline underline-offset-4 block mb-2"
          >
            Sign Out
          </button>
        </div>
      )}
    </footer>
  );
}
