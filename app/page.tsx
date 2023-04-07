"use client";
import Link from "next/link";

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1
        className={
          "my-6 text-4xl md:text-6xl text-slate-300 max-w-xl leading-10"
        }
      >
        <p className="">Plan Your Next Lesson in Seconds</p>
      </h1>
      <p className={"mb-12 text-lg text-gray-300 md:text-2xl max-w-xl"}>
        Use Falcon AI to create custom, Indian curriculum-specific lessons with
        effortless drag-and-drop.
      </p>
      <Link
        href={"/preferences"}
        className={`bg-emerald-500 text-slate-200 px-28 py-4 rounded-full text-lg font-semibold hover:bg-emerald-600 transition duration-200 ease-in-out`}
      >
        Start Now
      </Link>
    </div>
  );
};

export default LandingPage;
