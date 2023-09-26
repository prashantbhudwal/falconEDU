import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Avvvatars from "avvvatars-react";
import Link from "next/link";
import { BotsByUserId } from "../queries";
import type { ArrayElement } from "../queries";
import { getStudentBotURL } from "@/lib/urls";
import { cn } from "@/lib/utils";
const testPriorities = ["HIGH", "MEDIUM", "LOW"] as const;

const priorityColor: Record<(typeof testPriorities)[number], string> = {
  HIGH: "bg-destructive",
  MEDIUM: "bg-info",
  LOW: "",
};

type BotCardProps = {
  bot: ArrayElement<BotsByUserId>;
};
export default function BotCard({ bot }: BotCardProps) {
  return (
    <Link href={getStudentBotURL(bot.id)}>
      <Card className="relative flex flex-row max-w-sm border-none">
        <div
          className={cn("absolute inset-y-0 w-4", priorityColor["HIGH"])}
        ></div>
        <div className="flex flex-row space-x-5 px-4 py-5">
          <div className="pl-2">
            <Avatar>
              <AvatarImage
                src={bot.BotConfig.teacher.User.image!}
                alt="Bot Image"
              />
              <AvatarFallback>
                <Avvvatars value={bot.name} style="character" />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col space-y-1">
            <h1 className="">{bot.BotConfig.name}</h1>
            <p className="text-xs text-muted-foreground">by {bot.name}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
