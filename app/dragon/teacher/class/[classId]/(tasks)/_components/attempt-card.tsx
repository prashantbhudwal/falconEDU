"use client";
import { StudentsByBotConfigId } from "../[taskId]/test/queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Avvvatars from "avvvatars-react";
import { ClassDialog } from "../../../../components/class-dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { TaskType } from "@/types/dragon";
import { getReportUrl } from "@/lib/urls";
type action = {
  name: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: any;
  actionParams: any[];
};

type AttemptCardProps = {
  className?: string;
  student: StudentsByBotConfigId["students"][0];
  type: TaskType;
  taskId: string;
  classId: string;
  attemptNumber: number;
  attemptSubmitted: boolean;
};

const AttemptCard = ({
  className,
  student,
  type,
  taskId,
  classId,
  attemptNumber,
  attemptSubmitted,
}: AttemptCardProps) => {
  const link = getReportUrl({
    classId,
    testId: taskId,
    studentBotId: student.studentBotId,
    type,
  });
  const title = `Attempt ${attemptNumber}`;
  const isSubmitted = attemptSubmitted;
  const disabled = !isSubmitted && type == "test";
  return (
    <Link
      href={disabled ? "" : link}
      className={cn(
        "bg-base-200 max-w-3xl flex items-start py-6 space-x-6 w-full px-6 rounded-md hover:bg-base-100 relative my-1 border border-base-200",
        {
          "cursor-not-allowed hover:bg-base-200": disabled,
        },
        className
      )}
    >
      <div className="flex-grow border-none bg-inherit shadow-none flex flex-col space-y-3">
        <div className="flex flex-col space-y-1">
          <h1 className="font-bold ">{title}</h1>
          {type === "test" && (
            <>
              {isSubmitted ? (
                <p className="text-sm text-slate-400">Submitted</p>
              ) : (
                <p className="text-sm text-slate-400">Pending</p>
              )}
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export { AttemptCard };
