import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Avvvatars from "avvvatars-react";
import { cn } from "@/lib/utils";
import React from "react";
const testPriorities = ["HIGH", "MEDIUM", "LOW"] as const;

const priorityColor: Record<(typeof testPriorities)[number], string> = {
  HIGH: "bg-destructive",
  MEDIUM: "bg-info",
  LOW: "",
};

type ItemCardProps = {
  imageUrl?: string;
  priority?: (typeof testPriorities)[number];
  title: string;
  description?: string;
  icon?: React.ReactNode;
  isRead?: boolean;
};
export function ItemCard({
  imageUrl,
  priority = "LOW",
  title,
  description,
  icon,
  isRead = true,
}: ItemCardProps) {
  return (
    <Card className="relative flex flex-row max-w-sm border-none bg-base-300">
      <div
        className={cn("absolute inset-y-0 w-4", priorityColor[priority])}
      ></div>
      <div className={cn("absolute top-5 right-5")}>
        {!isRead && (
          <div className="flex gap-1 items-center">
            <div className="h-3 w-3 rounded-full bg-primary"></div>
          </div>
        )}
      </div>
      <div className="flex flex-row space-x-5 px-4 py-5">
        <div className="pl-2">
          <Avatar>
            <AvatarImage src={imageUrl} alt="User Avatar" />
            <AvatarFallback className="bg-base-300">
              {(icon && <div className="w-7">{icon}</div>) || (
                <Avvvatars value={title} style="shape" />
              )}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col space-y-1">
          <h1 className="">{title}</h1>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>
  );
}
