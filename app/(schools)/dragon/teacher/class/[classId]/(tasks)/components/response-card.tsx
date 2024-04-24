"use client";
import { StudentsByBotConfigId } from "@/lib/routers/botConfig";
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

type ResponseProps = {
  className?: string;
  student: StudentsByBotConfigId["students"][0];
  type: TaskType;
  canReattempt: boolean | undefined;
  taskId: string;
  classId: string;
  defaultAttemptId: string;
};

const ResponseCard = ({
  className,
  student,
  type,
  canReattempt,
  taskId,
  classId,
  defaultAttemptId,
}: ResponseProps) => {
  const link = getReportUrl({
    classId,
    testId: taskId,
    attemptId: defaultAttemptId,
    type,
  });
  const email = student.email;
  const title = student.name;
  const description = student.email;
  const avatarUrl = student.image;
  const isSubmitted = student.isSubmitted;
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
      <div className="py-1">
        <Avatar className={cn("h-12 w-12 ring ring-base-300/80", {})}>
          <AvatarImage src={avatarUrl ?? ""} />
          <AvatarFallback className="bg-base-300">
            <Avvvatars value={title ?? ""} style="shape" />
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-grow flex-col space-y-3 border-none bg-inherit shadow-none">
        <div className="flex flex-col space-y-1">
          <h1 className="font-bold ">{title}</h1>
          {description && (
            <div className="text-sm text-slate-600">{description}</div>
          )}
        </div>
        <div>
          {type === "test" && (
            <div className="flex gap-2">
              <CardChip
                value={student.isSubmitted ? "Attempted" : "Pending"}
                valueColor={
                  student.isSubmitted ? "text-primary" : "text-accent"
                }
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

type CardChipProps = {
  label?: string;
  value: string | React.ReactNode;
  valueColor?: string;
  className?: string;
};

const CardChip: React.FC<CardChipProps> = ({
  label,
  value,
  valueColor,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-start rounded-md px-4 pl-0 text-sm ",
        className,
      )}
    >
      {label && (
        <span className="font-semibold text-base-content">{label}:</span>
      )}
      <span className={`${valueColor || "text-base-content"}`}>{value}</span>
    </div>
  );
};

export { ResponseCard, CardChip };
