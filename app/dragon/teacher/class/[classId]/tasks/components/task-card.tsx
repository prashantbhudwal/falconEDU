import { type BotConfig } from "@prisma/client";
import { cn } from "@/lib/utils";
import {
  AcademicCapIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/solid";
import { cva } from "class-variance-authority";
import { TaskActions } from "./task-actions";

const Icons = [
  {
    name: "chat",
    icon: <AcademicCapIcon />,
  },
  {
    name: "test",
    icon: <ClipboardDocumentCheckIcon />,
  },
];

const taskVariants = cva("", {
  variants: {
    variant: {
      chat: "text-primary",
      test: "text-secondary",
    },
  },
  defaultVariants: {
    variant: "chat",
  },
});
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
  const type = config.type;
  const isArchived = !config.isActive;
  const variant = type as "chat" | "test";
  const createdAt = config.createdAt;
  const formattedDate = new Date(createdAt).toLocaleDateString("en-UK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const iconNew = Icons.find((i) => i.name === variant)?.icon;
  return (
    <div
      className={cn(
        "group max-w-4xl py-4 px-2 flex items-center space-x-2 h-24 shadow-md rounded-2xl border-transparent cursor-pointer bg-base-300 hover:bg-base-100 transition-colors duration-200 ease-in-out",
        className
      )}
      {...props}
    >
      <section
        className={cn(
          "flex-none w-1/12 min-w-[100px] h-full flex pl-4",
          taskVariants({ variant })
        )}
      >
        <div className="flex flex-col justify-center items-center gap-1">
          <div className="w-10 h-10">{iconNew}</div>
          <div className="rounded-full text-sm">{type}</div>
        </div>
      </section>
      <section className="flex-grow h-full py-1 flex flex-col space-y-2">
        <div className="font-medium tracking-wide capitalize truncate ">
          <div className="truncate text-lg font-semibold text-slate-400 ">
            {name}
          </div>
        </div>
        <div className="text-sm text-slate-500">{formattedDate}</div>
      </section>
      <section className="flex-none w-3/12 flex">
        <div className="hidden group-hover:block">
          <TaskActions
            configId={config.id}
            classId={classId}
            userId={userId}
            isArchived
          />
        </div>
      </section>
    </div>
  );
}
