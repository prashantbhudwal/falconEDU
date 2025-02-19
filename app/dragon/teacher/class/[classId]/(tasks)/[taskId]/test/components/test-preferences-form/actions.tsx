"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { HTMLProps, useRef } from "react";
import { LuPlusCircle } from "react-icons/lu";
import { RiListCheck3 } from "react-icons/ri";
import { LuFileText } from "react-icons/lu";

type PropTypes = HTMLProps<HTMLDivElement> & {
  addQuestions: () => void;
  questionCardHeight: number;
  createMcq: () => void;
  createFillInBlanks: () => void;
};

export const Actions = ({
  addQuestions,
  questionCardHeight,
  createMcq,
  createFillInBlanks,
  ...props
}: PropTypes) => {
  const actionBoxRef = useRef<HTMLDivElement>(null);

  const actionBoxHeight = actionBoxRef.current
    ? actionBoxRef.current?.clientHeight
    : 90;

  return (
    <div
      ref={actionBoxRef}
      className={cn(
        `absolute -right-10 bottom-0 flex flex-col gap-2 rounded border border-base-100 bg-base-200 p-2`,
      )}
      style={{
        transform: `translateY(${-(questionCardHeight - actionBoxHeight)}px)`,
      }}
    >
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger>
            <button className="text-slate-100" onClick={() => addQuestions()}>
              <LuPlusCircle />
            </button>
          </TooltipTrigger>
          <TooltipContent className="bg-slate-600 text-black">
            Add Question
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger>
            <button className="text-slate-100" onClick={() => createMcq()}>
              <RiListCheck3 />
            </button>
          </TooltipTrigger>
          <TooltipContent className="bg-slate-600 text-black">
            Create MCQ
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger>
            <button
              className="text-slate-100"
              onClick={() => createFillInBlanks()}
            >
              <LuFileText />
            </button>
          </TooltipTrigger>
          <TooltipContent className="bg-slate-600 text-black">
            Create Fill in Blanks
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
