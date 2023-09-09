"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { PropagateLoader } from "react-spinners";
import Beta from "@/components/beta";
import Image from "next/image";
import useTrackPage from "@/hooks/analytics/useTrackPage";
const LandingPage = () => {
  useTrackPage("Landing Page");
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session && sessionStatus === "authenticated") {
      router.push("/preferences");
    }
  }, [session, sessionStatus]);

  useEffect(() => {
    router.prefetch("/auth/login");
    router.prefetch("/preferences");
    if (session && sessionStatus === "authenticated") {
      router.prefetch("/preferences/topic");
      router.prefetch("/preferences/subtopic");
      router.prefetch("/merlin");
      router.prefetch("/magic/aid/lesson");
    }
  }, []);

  return (
    <div>
      <div className="flex min-h-screen flex-col items-center pt-8 text-center">
        <Image src={"/chubbi.png"} height={200} width={200} alt="Falcon Logo" />
        <Beta>
          <h1 className="my-6 max-w-xl text-2xl leading-10 text-slate-300 md:text-5xl lg:text-5xl">
            Welcome to FalconAI
          </h1>
        </Beta>
        <p className={"mb-12 mt-6 max-w-xl text-lg text-gray-500 md:text-xl"}>
          Create Lesson Plans, Worksheets, Activities and Assessments with AI
          that is easy to use and strictly follows your syllabus.
        </p>
        <button
          onClick={() => signIn("google", { callbackUrl: "/preferences" })}
          className={`rounded-lg bg-emerald-500 px-28 py-4 text-lg font-semibold text-slate-800 transition duration-200 ease-in-out hover:bg-emerald-600`}
        >
          {sessionStatus === "loading"
            ? "Signing you in..."
            : sessionStatus === "authenticated"
            ? "Taking you to the app..."
            : "Sign In"}
        </button>
        <p className="mt-4 text-xs">
          Works on large screens only. Use chrome, edge or any major browser for
          access.
        </p>
        {(sessionStatus === "loading" || sessionStatus === "authenticated") && (
          <div className="flex h-12 flex-col items-center justify-center gap-2">
            <PropagateLoader color={"#10B981"} />
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
