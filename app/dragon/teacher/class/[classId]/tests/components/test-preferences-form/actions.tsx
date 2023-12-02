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
import { LuCopy } from "react-icons/lu";

type PropTypes = HTMLProps<HTMLDivElement> & {
  addQuestions: () => void;
  createDuplicate: ({ data }: { data: any }) => void;
  questionCardHeight: number;
};

export const Actions = ({
  addQuestions,
  createDuplicate,
  questionCardHeight,
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
        `absolute flex flex-col gap-2 bottom-0 -right-10 rounded border border-base-100 p-2`
      )}
      style={{
        transform: `translateY(${-(questionCardHeight - actionBoxHeight)}px)`,
      }}
    >
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger>
            <button className="text-white" onClick={() => addQuestions()}>
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
            <button className="text-white" onClick={() => addQuestions()}>
              <LuCopy />
            </button>
          </TooltipTrigger>
          <TooltipContent className="bg-slate-600 text-black">
            Duplicate Question
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
