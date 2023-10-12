import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Avvvatars from "avvvatars-react";
import { BotsByUserId } from "../queries";
import type { ArrayElement } from "../queries";
import { cn } from "@/lib/utils";
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
};
export function ItemCard({
  imageUrl,
  priority = "LOW",
  title,
  description,
}: ItemCardProps) {
  return (
    <Card className="relative flex flex-row max-w-sm border-none">
      <div
        className={cn("absolute inset-y-0 w-4", priorityColor[priority])}
      ></div>
      <div className="flex flex-row space-x-5 px-4 py-5">
        <div className="pl-2">
          <Avatar>
            <AvatarImage src={imageUrl} alt="Bot Image" />
            <AvatarFallback className="bg-base-100">
              <Avvvatars value={title + description} style="shape" />
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
