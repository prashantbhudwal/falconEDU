"use client";
import { useWindowSize } from "usehooks-ts";
import Confetti from "react-confetti";
import { useAtom } from "jotai";
import { confettiAtom } from "@/lib/atoms/ui";
import { useEffect } from "react";
import { delay } from "lodash";

export const CelebrationConfetti = () => {
  const [isConfettiRunning, setIsConfettiRunning] = useAtom(confettiAtom);

  const { height, width } = useWindowSize();
  useEffect(() => {
    delay(() => {
      setIsConfettiRunning(false);
    }, 5000);
  }, [isConfettiRunning, setIsConfettiRunning]);

  if (!isConfettiRunning) return null;

  return (
    <Confetti
      width={width}
      height={height}
      numberOfPieces={1000}
      recycle={false}
    />
  );
};
