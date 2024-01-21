"use client";
import { StudentsByBotConfigId } from "../[taskId]/test/queries";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { TaskType } from "@/types/dragon";
import { getReportUrl, getReportUrlWithAttempts } from "@/lib/urls";
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
  attemptId: string;
};

const AttemptCard = ({
  className,
  student,
  type,
  taskId,
  classId,
  attemptNumber,
  attemptSubmitted,
  attemptId,
}: AttemptCardProps) => {
  const link = getReportUrl({
    classId,
    testId: taskId,
    attemptId,
    type,
  });
  const title = `Attempt ${attemptNumber}`;
  const isSubmitted = attemptSubmitted;
  const disabled = !isSubmitted && type == "test";
  return (
    <Link
      href={disabled ? "" : link}
      className={cn(
        "relative my-1 flex w-full max-w-3xl items-start space-x-6 rounded-md border border-base-200 bg-base-200 px-6 py-6 hover:bg-base-100",
        {
          "cursor-not-allowed hover:bg-base-200": disabled,
        },
        className,
      )}
    >
      <div className="flex flex-grow flex-col space-y-3 border-none bg-inherit shadow-none">
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
