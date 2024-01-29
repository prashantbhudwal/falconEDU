import { type BotConfig, type Class } from "@prisma/client";
import { cn } from "@/lib/utils";
import { TaskActions } from "./task-actions";
import { getFormattedDate, getTaskProperties } from "../../../../utils";
import { TaskType } from "@/types/dragon";
import { AllConfigsInClass } from "@/lib/routers/botConfigRouter";
import { db } from "@/lib/routers";
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
        "group flex h-20 max-w-2xl cursor-pointer items-center justify-between space-x-1 rounded-2xl border-transparent bg-base-200 px-6 py-4 shadow-md transition-colors duration-200 ease-in-out hover:bg-base-100",
        isArchived && "bg-base-200/40 hover:bg-base-200",
        className,
      )}
      {...props}
    >
      <section
        className={cn("flex h-full w-1/12 min-w-[80px] flex-none", iconColor)}
      >
        <div className="flex flex-col items-center justify-center space-y-1">
          <div className="h-8 w-8">
            <Icon className="h-8 w-8" />
          </div>
          <div className="rounded-full text-xs">{formattedType}</div>
        </div>
      </section>
      <section className="flex h-full flex-grow ">
        <div className="flex flex-grow flex-col space-y-2">
          <div className="truncate font-medium capitalize tracking-wide ">
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
      <section className="flex h-full w-2/12 flex-col justify-between">
        <section className="flex items-center space-x-3 self-end">
          <div className="hidden w-full group-hover:block">
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
        <section className="flex flex-none self-end">
          <TaskAnalytics analytics={analyticsStats} />
        </section>
      </section>
    </div>
  );
}
