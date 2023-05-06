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
    router.prefetch("/magic/aid/lesson");
  }, []);
  return (
    <div className="flex flex-col items-center text-center pt-8 min-h-screen">
      <h1 className="my-6 text-4xl md:text-5xl text-slate-300 max-w-xl leading-10">
        <div className="inline-flex items-start">
          <p className="">Welcome to FalconAI</p>
          <span className="text-sm font-semibold bg-yellow-300 text-yellow-800 px-2 py-1 rounded -mt-1 ml-2">
            beta
          </span>
        </div>
      </h1>
      <p className={"mb-12 text-lg text-gray-500 md:text-xl max-w-xl mt-6"}>
        For any help or suggestions, call us or drop a WhatsApp message at +91
        8879881971.
      </p>
      <Link
        href={"/preferences"}
        className={`bg-emerald-500 text-slate-800 px-28 py-4 rounded-lg text-lg font-semibold hover:bg-emerald-600 transition duration-200 ease-in-out`}
      >
        Start App
      </Link>
    </div>
  );
};

export default LandingPage;
