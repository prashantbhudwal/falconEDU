"use client";
import { getFormattedDate } from "../../teacher/utils";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Avvvatars from "avvvatars-react";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
const testPriorities = ["HIGH", "MEDIUM", "LOW"] as const;
import { Badge } from "@/components/ui/badge";

import { getDefaultChatReadStatus } from "../queries";
import { getTaskProperties } from "../../teacher/utils";
import { TaskType } from "@/types/dragon";

const priorityColor: Record<(typeof testPriorities)[number], string> = {
  HIGH: "bg-destructive",
  MEDIUM: "bg-info",
  LOW: "",
};

type ChatCardProps = {
  imageUrl?: string;
  priority?: (typeof testPriorities)[number];
  title: string;
  type: TaskType;
  icon?: React.ReactNode;
  botId: string;
  readStatus: boolean;
  createdAt: Date;
  isActive: boolean;
};
export function ChatCard({
  imageUrl,
  priority = "LOW",
  title,
  type,
  icon,
  botId,
  createdAt,
  isActive,
  readStatus: initialReadStatus,
}: ChatCardProps) {
  const [isRead, setIsRead] = useState(initialReadStatus);
  useEffect(() => {
    async function getStatus() {
      const { isRead } = await getDefaultChatReadStatus(botId);
      setIsRead(isRead);
    }
    getStatus();
  }, [botId]);

  const taskProperties = getTaskProperties(type);
  return (
    <Card
      className={cn("relative flex flex-row max-w-sm border-none bg-base-300", {
        grayscale: !isActive,
      })}
    >
      <div
        className={cn("absolute inset-y-0 w-4", priorityColor[priority])}
      ></div>
      <div className={cn("absolute top-5 right-5")}>
        {!isRead && (
          <div className="flex gap-1 items-center">
            <div className="h-3 w-3 rounded-full bg-accent"></div>
          </div>
        )}
      </div>
      <div className="flex flex-row space-x-5 px-4 py-5 w-full">
        <div
          className={cn("pl-2", {
            "text-accent": !isRead,
          })}
        >
          <Avatar className={cn("h-12 w-12", taskProperties.iconColor)}>
            <AvatarImage src={imageUrl} alt="User Avatar" />
            <AvatarFallback className="bg-base-100">
              {(icon && <div className="w-6">{icon}</div>) || (
                <Avvvatars value={title} style="shape" />
              )}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col space-y-2 items-start w-full">
          <div className="flex flex-row justify-between w-full">
            <h1 className="capitalize">{title.toLocaleLowerCase()}</h1>{" "}
            {!isActive && (
              <span className="text-xs text-slate-500">Inactive</span>
            )}
          </div>
          <div className="flex flex-row justify-between w-full">
            <div className=" text-slate-500 text-xs">
              {taskProperties.formattedType}
            </div>
            <div className="text-slate-600 text-xs">
              {getFormattedDate(createdAt)}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
