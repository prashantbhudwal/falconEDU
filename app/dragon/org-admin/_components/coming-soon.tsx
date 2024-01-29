"use client";
import workingAnimation from "@/public/animations/working.json";
import Lottie from "lottie-react";

export const ComingSoon = () => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="mb-4 text-2xl font-semibold">Coming Soon</h2>
      <Lottie animationData={workingAnimation} />
      <p className="text-center text-gray-500">
        {"We're working hard to bring you this feature. Stay tuned!"}
      </p>
    </div>
  );
};
