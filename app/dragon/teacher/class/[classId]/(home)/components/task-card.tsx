import { type BotConfig } from "@prisma/client";
import { cn } from "@/lib/utils";
import {
  AcademicCapIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/solid";
import { cva } from "class-variance-authority";
import { TaskActions } from "./task-actions";
import { getFormattedDate, getTaskProperties } from "../../../../utils";
import { TaskType } from "@/types/dragon";

type TaskCardProps = {
  className?: string;
  config: BotConfig;
  classId: string;
  userId: string;
};

export function TaskCard({
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
  return (
    <div
      className={cn(
        "bg-base-200 group py-4 px-2 flex items-center space-x-2 h-24 shadow-md rounded-2xl border-transparent cursor-pointer hover:bg-base-100 transition-colors duration-200 ease-in-out",
        isArchived && "bg-base-200/40 hover:bg-base-200",
        className
      )}
      {...props}
    >
      <section
        className={cn(
          "flex-none w-1/12 min-w-[100px] h-full flex pl-4",
          iconColor
        )}
      >
        <div className="flex flex-col justify-center items-center gap-1">
          <div className="w-10 h-10">
            <Icon className="h-10 w-10" />
          </div>
          <div className="rounded-full text-sm">{formattedType}</div>
        </div>
      </section>
      <section className="flex-grow h-full py-1 flex items-center">
        <div className="flex flex-col space-y-2 flex-grow">
          <div className="font-medium tracking-wide capitalize truncate ">
            <div className="truncate text-lg font-semibold text-slate-400 ">
              {name}
            </div>
          </div>
          <div className="text-sm text-slate-500">{formattedDate}</div>
        </div>
        <div
          className={cn("text-slate-600 text-sm w-16", {
            "text-primary": isPublished,
            "": !isPublished,
          })}
        >
          {isPublished ? "Published" : ""}
        </div>
      </section>
      <section className="flex-none w-2/12 flex">
        <div className="hidden group-hover:block w-full">
          <TaskActions
            configId={config.id}
            classId={classId}
            userId={userId}
            isArchived={isArchived}
            isPublished={isPublished}
            type={type}
          />
        </div>
      </section>
    </div>
  );
}
