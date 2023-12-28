"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useCreateNewConfig } from "@/app/dragon/teacher/hooks/use-create-config";
import { AllConfigsInClass } from "@/app/dragon/teacher/routers/botConfigRouter";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { PlusIcon } from "@radix-ui/react-icons";
import { TaskType } from "@/types/dragon";
import { getTaskProperties } from "@/app/dragon/teacher/utils";

type propType = {
  classId: string;
  configType: TaskType;
  configs: AllConfigsInClass;
  showActions: boolean;
};

export const ConfigCard = ({
  classId,
  configType,
  configs,
  showActions,
}: propType) => {
  const { data } = useSession();
  const userId = data?.user?.id ?? "";
  const createNewConfig = useCreateNewConfig();

  const cardConfigs =
    configType === "chat"
      ? configs.chat
      : configType === "lesson"
        ? configs.lesson
        : configs.test;
  const allConfigs = cardConfigs.all;
  const publishedConfigs = cardConfigs.published;
  const unpublishedConfigs = cardConfigs.unpublished;
  const archivedConfigs = cardConfigs.archived;
  const activeConfigs = cardConfigs.active;

  return (
    <Card className="w-[300px] h-[300px] flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="capitalize text-2xl">
          {getTaskProperties(configType).formattedType}
        </CardTitle>
        <CardDescription>
          {publishedConfigs.length}/{allConfigs.length} published
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div>Active</div>
              <div className="text-2xl">{activeConfigs.length}</div>
            </div>
            <div className="flex justify-between items-center">
              <div>Archived</div>
              <div className="text-2xl">{archivedConfigs.length}</div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {showActions && (
          <Button
            variant={"outline"}
            className="px-2 capitalize flex items-center justify-start gap-3 w-full group-hover:text-text-950 group"
            onClick={() => createNewConfig({ userId, classId, configType })}
          >
            <PlusIcon className="w-5 text-accent group-hover:text-inherit" />
            <div>New {getTaskProperties(configType).formattedType}</div>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
