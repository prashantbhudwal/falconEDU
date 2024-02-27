"use client";
import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import React, { useState, useEffect } from "react";
import { CheckmarkIcon } from "../icons";

type Step = {
  step: string;
  seconds: number;
};

type Steps = [Step?, Step?, Step?, Step?];
export const testData: Steps = [
  {
    step: "Sending the data to AI",
    seconds: 20,
  },
  {
    step: "AI is learning from the data",
    seconds: 5,
  },
  {
    step: "AI is processing the data",
    seconds: 5,
  },
  {
    step: "AI is verifying the data",
    seconds: 2,
  },
] as const;

const loadingVariants = cva("rounded transition-all duration-1000", {
  variants: {
    color: {
      primary: "bg-gradient-to-r from-primary/60 to-primary",
      destructive: "bg-gradient-to-r from-destructive/60 to-destructive",
      secondary: "bg-gradient-to-r from-secondary/60 to-secondary",
      accent: "bg-gradient-to-r from-accent/60 to-accent",
    },
    size: {
      default: "h-4",
      sm: "h-3",
      lg: "h-5",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface LoadingProps extends VariantProps<typeof loadingVariants> {
  steps: Steps;
  className?: string;
}

export const Processing = ({
  steps,
  color = "primary",
  size,
  className,
}: LoadingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const stepSeconds = steps[currentStep]?.seconds ?? 0;
    if (elapsedTime >= stepSeconds) {
      if (currentStep < steps.length - 1) {
        setCurrentStep((prevStep) => prevStep + 1);
        setElapsedTime(0);
      } else {
        setIsComplete(true);
      }
    }
  }, [elapsedTime, steps, currentStep]);

  useEffect(() => {
    const stepSeconds = steps[currentStep]?.seconds ?? 0;
    setElapsedTime(0); // Reset elapsed time for the new step

    const updateElapsedTime = (prevElapsedTime: number) => {
      if (prevElapsedTime < stepSeconds) {
        return prevElapsedTime + 1;
      } else {
        clearInterval(intervalId);
        return prevElapsedTime;
      }
    };

    const intervalId = setInterval(() => {
      setElapsedTime(updateElapsedTime);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [currentStep]);

  return (
    <div className="pointer-events-auto fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm backdrop-filter">
      <div
        className={cn(
          "pointer-events-none flex w-full max-w-96 select-none flex-col space-y-8 rounded bg-base-300 p-6  pt-10 ring-1",
          className,
        )}
      >
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col space-y-3">
            <div className="fle-row flex items-center space-x-2">
              <p className="text-sm">{step?.step}</p>
              {(currentStep > index || isComplete) && (
                <CheckmarkIcon size="xs" color="primary" className="" />
              )}
            </div>
            <div
              className={cn(
                "w-full rounded bg-gray-700",
                loadingVariants({ size }),
              )}
            >
              <div
                className={cn(loadingVariants({ color, size }), {
                  "animate-in": index === currentStep,
                  "w-full": index < currentStep,
                  "w-0": index > currentStep,
                })}
                style={{
                  width:
                    index === currentStep
                      ? `${(elapsedTime / (step?.seconds ?? 1)) * 100}%`
                      : undefined,
                }}
              ></div>
            </div>
          </div>
        ))}
        {isComplete ? (
          <div className="animate-pulse self-center text-xs">
            Finishing up...
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};
