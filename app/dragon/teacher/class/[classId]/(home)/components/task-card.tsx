import { type BotConfig, type Class } from "@prisma/client";
import { cn } from "@/lib/utils";
import { TaskActions } from "./task-actions";
import { getFormattedDate, getTaskProperties } from "../../../../utils";
import { TaskType } from "@/types/dragon";
import { AllConfigsInClass } from "@/app/dragon/teacher/routers/botConfigRouter";
import { db } from "@/app/dragon/teacher/routers";
import TaskAnalytics from "./task-analytics";

type TaskCardProps = {
  className?: string;
  config: AllConfigsInClass["all"][0];
  classId: string;
  userId: string;
};

export async function TaskCard({
  className,
  config,
  classId,
  userId,
  ...props
}: TaskCardProps) {
  const name = config.name;
  const type = config.type as TaskType;
  const isArchived = !config.isActive;
  const isPublished = config.published;
  const createdAt = config.createdAt;
  const formattedDate = getFormattedDate(createdAt);
  const { Icon, iconColor, formattedType } = getTaskProperties(type);
  let analyticsStats = null;
  if (isPublished) {
    const analytics = await db.studentRouter.getTaskStats({
      classId,
      taskId: config.id,
      taskType: type,
    });

    analyticsStats = analytics;
  }

  return (
    <div
      className={cn(
        "max-w-2xl bg-base-200 group py-4 px-2 flex items-center space-x-1 justify-between h-20 shadow-md rounded-2xl border-transparent cursor-pointer hover:bg-base-100 transition-colors duration-200 ease-in-out",
        isArchived && "bg-base-200/40 hover:bg-base-200",
        className
      )}
      {...props}
    >
      <section
        className={cn(
          "flex-none w-1/12 min-w-[80px] h-full flex pl-4",
          iconColor
        )}
      >
        <div className="flex flex-col justify-center items-center space-y-1">
          <div className="w-8 h-8">
            <Icon className="h-8 w-8" />
          </div>
          <div className="rounded-full text-xs">{formattedType}</div>
        </div>
      </section>
      <section className="flex-grow h-full flex ">
        <div className="flex flex-col space-y-2 flex-grow">
          <div className="font-medium tracking-wide capitalize truncate ">
            <div className="truncate font-semibold text-slate-400 ">{name}</div>
          </div>
          <div className="flex flex-row items-baseline space-x-5 text-xs text-slate-500">
            {isPublished ? (
              <div className="text-primary/80"> Published </div>
            ) : (
              <div> Draft </div>
            )}
            <div>Created: {formattedDate}</div>
          </div>
        </div>
      </section>
      <section className="flex flex-col w-2/12 justify-between h-full">
        <section className="flex self-end items-center space-x-3">
          <div className="hidden group-hover:block w-full">
            {config.Class?.isActive && (
              <TaskActions
                configId={config.id}
                classId={classId}
                userId={userId}
                isArchived={isArchived}
                isPublished={isPublished}
                type={type}
              />
            )}
          </div>
        </section>
        <section className="flex-none flex self-end">
          <TaskAnalytics analytics={analyticsStats} />
        </section>
      </section>
    </div>
  );
}
