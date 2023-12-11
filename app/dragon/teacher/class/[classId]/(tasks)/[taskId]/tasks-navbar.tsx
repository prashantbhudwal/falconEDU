"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { db } from "../../../../routers";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getTaskIcon } from "../../utils";
import { BotConfig } from "@prisma/client";
import {
  ChevronLeftIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/solid";
import { cn } from "@/lib/utils";
import {
  getClassURL,
  getTaskResponsesUrlByType,
  getTaskUrlByType,
} from "@/lib/urls";
import { UsersIcon } from "@heroicons/react/24/outline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestAnalysis } from "./test/components/test-analysis/test-analysis";
import usePageTracking from "@/hooks/usePageTracking";
import { useSelectedLayoutSegment } from "next/navigation";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { LuArchive, LuArchiveRestore } from "react-icons/lu";
import { ClassDialog } from "@/app/dragon/teacher/components/class-dialog";
import { useConfigPublishing } from "@/app/dragon/teacher/hooks/use-config-publishing";
import { useEffect, useState } from "react";

export function TasksNavbar({
  classId,
  userId,
  nameOfClass,
  task,
}: {
  classId: string;
  userId: string;
  nameOfClass: string;
  task: BotConfig;
}) {
  const { currentPage } = usePageTracking();
  const layoutSegment = useSelectedLayoutSegment();
  const test = currentPage.endsWith("test");
  const responses = currentPage.endsWith("responses");
  const name = task.name;
  const type = task.type;
  return (
    <div className="navbar flex w-full bg-base-300 border-b border-base-200 py-0 h-full">
      <div className="navbar-start gap-4 pr-2 flex">
        <ClassLink classId={classId} name={nameOfClass} />
      </div>
      <div className="navbar-center self-end">
        <Tabs defaultValue="test">
          <TabsList className="flex w-96 bg-transparent border-b">
            <TabsTrigger
              className="w-1/2 data-[state=active]:border-b-[1px] data-[state=active]:bg-transparent text-lg border-white rounded-none"
              value="test"
            >
              <TaskLink
                type={type}
                classId={classId}
                taskId={task.id}
                name={name}
              />
            </TabsTrigger>
            <TabsTrigger
              value="responses"
              className="w-1/2 data-[state=active]:border-b-[1px] data-[state=active]:bg-transparent text-lg border-white rounded-none"
            >
              <ResponseLink type={type} classId={classId} configId={task.id} />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="navbar-end pr-1 flex gap-4">
        <TaskOptionsDropdown classId={classId} userId={userId} task={task} />
        <PublishButton task={task} classId={classId} />
      </div>
    </div>
  );
}

const ClassLink = function ({
  classId,
  name,
}: {
  classId: string;
  name: string;
}) {
  return (
    <Link href={getClassURL(classId)}>
      <Button
        className="flex items-center gap-1 hover:bg-base-300 hover:text-slate-100 hover:font-semibold"
        variant="ghost"
        size="sm"
      >
        <ChevronLeftIcon className="w-6" />
        <div>{name}</div>
      </Button>
    </Link>
  );
};

const TaskLink = function ({
  type,
  classId,
  taskId,
  name,
}: {
  type: string;
  classId: string;
  taskId: string;
  name: string;
}) {
  const { Icon, iconColor } = getTaskIcon(type);
  return (
    <Link
      href={getTaskUrlByType({
        type,
        classId,
        configId: taskId,
      })}
      className="w-full  flex justify-center"
    >
      <div className={cn("flex items-center gap-1 ", iconColor)}>
        <Icon className="w-5" />
        <div className="capitalize">{type}</div>
      </div>
    </Link>
  );
};

const ResponseLink = function ({
  type,
  classId,
  configId,
}: {
  type: string;
  classId: string;
  configId: string;
}) {
  return (
    <Link
      href={getTaskResponsesUrlByType({
        type,
        classId,
        configId,
      })}
      className="w-full  flex justify-center"
    >
      Responses
    </Link>
  );
};

export const TaskOptionsDropdown = function ({
  classId,
  userId,
  task,
}: {
  classId: string;
  userId: string;
  task: BotConfig;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="flex items-center gap-1">
        <EllipsisHorizontalIcon className="w-6 text-slate-500" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuItem
          className="flex items-center gap-1"
          onSelect={() => {}}
        >
          <ArchiveButton task={task} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ArchiveButton = function ({ task }: { task: BotConfig }) {
  const isArchived = !task.isActive;
  const taskId = task.id;
  const type = task.type;

  const archiveHandler = async (handlerType: string) => {
    if (handlerType === "archive") {
      const { success } = await db.bot.archiveAllBotsOfBotConfig(taskId);
      if (success) {
        return;
      }
    }
    if (handlerType === "unarchive") {
      const { success } = await db.bot.unArchiveAllBotsOfBotConfig(taskId);
      if (success) {
        return;
      }
    }
  };

  const archiveAction = isArchived ? "unarchive" : "archive";
  return (
    <ClassDialog
      title={`${isArchived ? "Un-archive" : "Archive"} ${type}`}
      description={`The ${type} will be ${
        isArchived ? "enabled" : "disabled"
      } for all students in the class.`}
      action={() => archiveHandler(archiveAction)}
      trigger={
        <div className="gap-1 flex items-center">
          {isArchived ? <LuArchiveRestore /> : <LuArchive />}
          <div>{isArchived ? "Un-archive" : "Archive"}</div>
        </div>
      }
    />
  );
};

const PublishButton = function ({
  task: initialTask,
  classId,
}: {
  task: BotConfig;
  classId: string;
}) {
  const [task, SetTask] = useState<BotConfig>(initialTask);
  const [hover, setHover] = useState(false);
  const isPublished = task.published;
  const taskId = task.id;
  const type = task.type;
  const {
    onPublish,
    onUnPublish,
    loading,
    error: publishingError,
    config: updatedTask,
  } = useConfigPublishing({
    classId,
    botId: taskId,
  });

  useEffect(() => {
    if (updatedTask) {
      SetTask(updatedTask);
    }
  }, [updatedTask, taskId, publishingError]);

  const title = isPublished ? `Unpublish ${type}` : `Publish ${type}`;
  const description = isPublished
    ? `Unpublishing will make the ${type} unavailable for all students.`
    : `Publishing will make the ${type} available for all students.`;
  const action = isPublished ? onUnPublish : onPublish;

  return (
    <ClassDialog
      title={title}
      description={description}
      action={action}
      trigger={
        <Button
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          type="button"
          variant={isPublished ? "outline" : "default"}
          size="sm"
          className={cn({
            "text-primary hover:bg-destructive ": isPublished,
          })}
          disabled={loading}
        >
          {loading
            ? "Processing..."
            : isPublished
              ? hover
                ? "Unpublish"
                : "Published"
              : "Publish"}
        </Button>
      }
    />
  );
};
