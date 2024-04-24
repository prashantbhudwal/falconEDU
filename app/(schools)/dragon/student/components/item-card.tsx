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
  isSubmitted?: boolean;
};
export function ItemCard({
  imageUrl,
  priority = "LOW",
  title,
  description,
  icon,
  isRead = true,
  isSubmitted,
}: ItemCardProps) {
  return (
    <Card className="relative flex max-w-sm flex-row border-none bg-base-300">
      <div
        className={cn("absolute inset-y-0 w-4", priorityColor[priority])}
      ></div>
      <div className={cn("absolute right-5 top-5")}>
        {!isRead && (
          <div className="flex items-center gap-1">
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
          <div className="text-xs text-muted-foreground">
            {isSubmitted ? (
              <div className="text-primary">
                {isSubmitted ? "Submitted" : ""}
              </div>
            ) : (
              <p>{description}</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
