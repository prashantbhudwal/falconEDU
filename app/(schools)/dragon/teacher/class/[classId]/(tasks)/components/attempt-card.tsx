"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { TaskType } from "@/types/dragon";
import { getReportUrl } from "@/lib/urls";
import { AllBotChats, StudentsByBotConfigId } from "@/lib/routers/botConfig";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AttemptCardProps = {
  className?: string;
  student: StudentsByBotConfigId["students"][0];
  type: TaskType;
  taskId: string;
  classId: string;
  attempt: AllBotChats[0];
  canReattempt: boolean;
};
type StatusResult = {
  status: string;
  statusText: string;
};
const statusMap = {
  notStarted: { status: "notStarted", statusText: "Has not started" },
  inProgress: {
    status: "inProgress",
    statusText: "Started but not submitted",
  },
  submitted: { status: "submitted", statusText: "Submitted" },
};

const getStatus = (hasStarted: boolean, isSubmitted: boolean): StatusResult => {
  if (!hasStarted) return statusMap.notStarted;
  if (!isSubmitted) return statusMap.inProgress;
  return statusMap.submitted;
};

const AttemptCard = ({
  className,
  student,
  type,
  taskId,
  classId,
  attempt,
  canReattempt,
}: AttemptCardProps) => {
  const {
    id: attemptId,
    attemptNumber,
    isSubmitted: attemptSubmitted,
    createdAt,
  } = attempt;
  const link = getReportUrl({
    classId,
    testId: taskId,
    attemptId,
    type,
  });

  const messages = attempt.messages as string[] | undefined;
  const hasStarted = messages && messages.length > 2 ? true : false;
  const title = canReattempt ? `Attempt ${attemptNumber}` : "View Response";
  const isSubmitted = attemptSubmitted;
  const disabled = !isSubmitted && type == "test";

  const { status, statusText } = getStatus(hasStarted, isSubmitted);

  return (
    <Link
      href={disabled ? "" : link}
      className={cn(
        {
          "cursor-not-allowed hover:bg-base-200": disabled,
        },
        className,
      )}
    >
      <Card className="z-50 hover:-translate-y-1 hover:bg-base-100 hover:shadow hover:shadow-gray-800 hover:duration-500 active:translate-y-2">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription className="flex flex-row space-x-2">
            <div
              className={cn({
                "text-error": status === "notStarted",
                "text-warning": status === "inProgress",
                "text-primary": status === "submitted",
              })}
            >
              {statusText}
            </div>
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};

export { AttemptCard };
