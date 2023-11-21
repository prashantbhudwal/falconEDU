"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getEditBotURL, getStudentsURL, getTestEditBotURL } from "@/lib/urls";
import Link from "next/link";
import React, { useState } from "react";
import {
  typePublishedBotByClassId,
  typePublishedTestByClassId,
} from "../queries";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useCreateNewConfig } from "@/app/dragon/teacher/hooks/use-create-config";
import { Configs } from "@/app/dragon/teacher/routers/botConfigRouter";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@radix-ui/react-icons";

type propType = {
  classId: string;
  configType: "chat" | "test";
  configs: Configs;
};

export const ConfigCard = ({ classId, configType, configs }: propType) => {
  const { data } = useSession();
  const userId = data?.user?.id ?? "";
  const createNewConfig = useCreateNewConfig();

  const cardConfigs = configType === "chat" ? configs.chat : configs.test;
  const allConfigs = cardConfigs.all;
  const publishedConfigs = cardConfigs.published;
  const unpublishedConfigs = cardConfigs.unpublished;
  const archivedConfigs = cardConfigs.archived;
  const activeConfigs = cardConfigs.active;

  return (
    <Card className="w-[300px] h-[300px] flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="capitalize text-2xl">
          {configType === "chat" ? "Bots" : "Tests"}
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
        <Button
          variant={"outline"}
          className="px-2 capitalize flex items-center justify-start gap-3 w-full group-hover:text-slate-950 group"
          onClick={() => createNewConfig({ userId, classId, configType })}
        >
          <PlusIcon className="w-5 text-accent group-hover:text-inherit" />
          <div>New {configType === "chat" ? "bot" : "test"}</div>
        </Button>
      </CardFooter>
    </Card>
  );
};
