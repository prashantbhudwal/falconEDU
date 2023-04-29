"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LandingPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.prefetch("/preferences");
    router.prefetch("/preferences/topic");
    router.prefetch("/preferences/subtopic");
    router.prefetch("/merlin");
  }, []);
  return (
    <div className="flex flex-col items-center text-center pt-8 min-h-screen">
      <h1
        className={
          "my-5 text-4xl md:text-5xl text-slate-300 max-w-3xl leading-10"
        }
      >
        Create Lessons, Handouts, and Assessments in Seconds, with AI
      </h1>
      <p className={"mb-12 text-lg text-gray-400 md:text-2xl max-w-3xl mt-6"}>
        Never Google, or open a textbook. FalconAI follows the syllabus and
        generates everything you need for your class.
      </p>
      <Link
        href={"/preferences"}
        className={`bg-emerald-500 text-slate-800 px-28 py-4 rounded-lg text-lg font-semibold hover:bg-emerald-600 transition duration-200 ease-in-out`}
      >
        Start Now
      </Link>
    </div>
  );
};

export default LandingPage;
