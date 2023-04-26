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
          "my-6 text-4xl md:text-6xl text-slate-300 max-w-xl leading-10"
        }
      >
        <p className="">Create Your Next Lesson in Seconds</p>
      </h1>
      <p className={"mb-12 text-lg text-gray-400 md:text-2xl max-w-xl mt-6"}>
        Use Falcon AI to create lesson plans specific to your curriculum, with
        effortless drag and drop.
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
