"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { db } from "../../../../../../../lib/routers";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getTaskProperties } from "../../../../../../../lib/helpers";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import usePageTracking from "@/hooks/usePageTracking";
import { LuArchive, LuArchiveRestore } from "react-icons/lu";
import { ClassDialog } from "@/app/dragon/teacher/components/class-dialog";
import { useConfigPublishing } from "@/app/dragon/teacher/hooks/use-config-publishing";
import { useEffect, useState } from "react";
import { TaskType } from "@/types/dragon";
import { typeGetBotConfigByConfigId } from "@/lib/routers/botConfigRouter";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useSetAtom } from "jotai";
import { evalDrawerAtom } from "@/lib/atoms/ui";
import { PublishButton } from "./eval-drawer/publish-btn";

export function TasksNavbar({
  classId,
  userId,
  task,
  totalParsedQuestions,
}: {
  classId: string;
  userId: string;
  task: NonNullable<typeGetBotConfigByConfigId>;
  totalParsedQuestions: number | undefined;
}) {
  const setEvalDrawer = useSetAtom(evalDrawerAtom);
  const { currentPage } = usePageTracking();
  const isResponse = currentPage.endsWith("responses");
  const name = task.name;
  const type = task.type as TaskType;

  return (
    <div className="navbar flex h-full w-full border-b border-base-200 bg-base-300 py-0">
      <div className="navbar-start flex gap-4 pr-2">
        <ClassLink classId={classId} />
      </div>
      <div className="navbar-center self-end">
        <Tabs defaultValue="test">
          <TabsList className="flex w-96 border-b bg-transparent">
            <TabsTrigger
              className={cn(
                "w-1/2 rounded-none border-white bg-base-300 text-lg data-[state=active]:bg-transparent",
                {
                  "border-b-[1px]": !isResponse,
                },
              )}
              value="task"
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
              className={cn(
                "w-1/2 rounded-none border-white bg-base-300 text-lg data-[state=active]:bg-transparent",
                {
                  "border-b-[1px] ": isResponse,
                },
              )}
            >
              <ResponseLink type={type} classId={classId} configId={task.id} />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="navbar-end flex items-center space-x-6 pr-1">
        <ReAttemptSwitch
          classId={classId}
          taskId={task.id}
          canReattempt={task.canReAttempt}
          className="justify-end"
        />
        {task.Class?.isActive && (
          <>
            {!task.published && (
              <TaskOptionsDropdown
                classId={classId}
                userId={userId}
                task={task}
              />
            )}
          </>
        )}

        {task.published ? (
          <PublishButton
            task={task}
            classId={classId}
            cancelPublish={Number(totalParsedQuestions) > 10}
            isEmptyTest={
              task.type === "test" &&
              (Number(totalParsedQuestions) === 0 || !totalParsedQuestions)
            }
          />
        ) : (
          <Button
            size="sm"
            className="flex items-center gap-1 hover:bg-base-300 hover:font-semibold hover:text-slate-100"
            onClick={() => setEvalDrawer(true)}
          >
            <div className="capitalize">Check & Publish</div>
          </Button>
        )}
      </div>
    </div>
  );
}

const ClassLink = function ({ classId }: { classId: string }) {
  return (
    <Link href={getClassURL(classId)}>
      <Button
        className="flex items-center gap-1 hover:bg-base-300 hover:font-semibold hover:text-slate-100"
        variant="ghost"
        size="sm"
      >
        <ChevronLeftIcon className="w-6" />
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
  type: TaskType;
  classId: string;
  taskId: string;
  name: string;
}) {
  const { Icon, iconColor, formattedType } = getTaskProperties(type);
  return (
    <Link
      href={getTaskUrlByType({
        type,
        classId,
        configId: taskId,
      })}
      className="flex  w-full justify-center"
    >
      <div className={cn("flex items-center gap-1 ", iconColor)}>
        <Icon className="w-5" />
        <div className="capitalize">{formattedType}</div>
      </div>
    </Link>
  );
};

const ResponseLink = function ({
  type,
  classId,
  configId,
}: {
  type: TaskType;
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
      className="flex  w-full justify-center"
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
      <DropdownMenuTrigger
        asChild
        className="flex cursor-pointer items-center gap-1"
      >
        <EllipsisHorizontalIcon className="w-6 text-slate-500" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 cursor-pointer">
        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-1"
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
        <div className="flex items-center gap-1">
          {isArchived ? <LuArchiveRestore /> : <LuArchive />}
          <div>{isArchived ? "Un-archive" : "Archive"}</div>
        </div>
      }
    />
  );
};

export function ReAttemptSwitch({
  classId,
  taskId,
  canReattempt,
  className,
}: {
  classId: string;
  taskId: string;
  canReattempt: boolean;
  className?: string;
}) {
  const formSchema = z.object({
    isReAttemptEnabled: z.boolean(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isReAttemptEnabled: canReattempt,
    },
  });
  const [switchValue, setSwitchValue] = useState(canReattempt);

  const autoSubmit = async (value: boolean) => {
    try {
      if (value) {
        await db.botConfig.enableReAttempt({ classId, taskId });
      } else {
        await db.botConfig.disableReAttempt({ classId, taskId });
      }
      setSwitchValue(value); // Update the switch value on successful operation
      toast.success("Re-attempt status updated");
    } catch (err) {
      form.setValue("isReAttemptEnabled", switchValue); // Revert the switch to previous state on failure
      toast("Error");
    }
  };

  return (
    <Form {...form}>
      <form className={cn("flex items-center gap-1", className)}>
        <FormItem className="flex flex-row items-center gap-2">
          <FormLabel className="pt-2 text-xs">Allow Re-attempts</FormLabel>
          <FormControl>
            <Switch
              checked={form.watch("isReAttemptEnabled")}
              onCheckedChange={(newValue) => {
                form.setValue("isReAttemptEnabled", newValue, {
                  shouldValidate: true,
                });
                autoSubmit(newValue);
              }}
            />
          </FormControl>
        </FormItem>
      </form>
    </Form>
  );
}
