import { getFormattedDate } from "../../teacher/utils";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Avvvatars from "avvvatars-react";
import { cn } from "@/lib/utils";
const testPriorities = ["HIGH", "MEDIUM", "LOW"] as const;
import { type BotsByTeacherAndStudentID } from "../../teacher/routers/botRouter";
import { getChatsByBotId, getDefaultChatReadStatus } from "../queries";
import { getTaskProperties } from "../../teacher/utils";
import { TaskType } from "@/types/dragon";
import { getStudentBotChatURL, getStudentBotURL } from "@/lib/urls";
import Link from "next/link";
import format from "date-fns/format";
import prisma from "@/prisma";
import { PuzzlePieceIcon } from "@heroicons/react/24/solid";
const priorityColor: Record<(typeof testPriorities)[number], string> = {
  HIGH: "bg-destructive",
  MEDIUM: "bg-info",
  LOW: "",
};

type TaskCardProps = {
  bot: BotsByTeacherAndStudentID[0];
  imageUrl?: string;
  priority?: (typeof testPriorities)[number];
};
export async function TaskCard({
  imageUrl,
  priority = "LOW",
  bot,
}: TaskCardProps) {
  const getDefaultStudentChat = async (botId: string) => {
    const chats = await getChatsByBotId(botId);
    if (!chats) {
      return null;
    }
    const defaultChat = chats.find((chat) => chat.isDefault);

    if (defaultChat) {
      return defaultChat;
    }
    return null;
  };

  const title = bot.BotConfig.name;
  const { createdAt, isActive, isSubmitted, id: botId } = bot;

  const defaultChat = await getDefaultStudentChat(botId);
  // TODO: Fix this, this will give error when there is no default chat
  if (!defaultChat) {
    return null;
  }
  const defaultChatUrl = getStudentBotChatURL(
    defaultChat.bot.id,
    defaultChat.id
  );
  const defaultChatSubmitted = defaultChat.isSubmitted;

  const multipleChatUrl = getStudentBotURL(botId);
  const { isRead } = await getDefaultChatReadStatus(botId);
  const readStatus = await getDefaultChatReadStatus(botId);
  const type = bot.BotConfig.type as TaskType;
  const taskProperties = getTaskProperties(type);
  const Icon = taskProperties.Icon;
  const icon = <Icon className="w-6" />;
  const canReattempt = bot.BotConfig.canReAttempt;

  const url = canReattempt ? multipleChatUrl : defaultChatUrl ?? "";

  let attemptCount = 1;
  if (canReattempt) {
    attemptCount = await prisma.botChat.count({
      where: {
        botId,
      },
    });
  }
  return (
    <Link href={url} key={bot.id}>
      <Card
        className={cn(
          "relative flex flex-row max-w-sm border-none bg-base-300",
          {
            grayscale: !isActive,
          }
        )}
      >
        <div
          className={cn("absolute inset-y-0 w-4", priorityColor[priority])}
        ></div>
        {/* TODO Fix this using revalidate later */}
        {/* <div className={cn("absolute top-5 right-5")}>
          {!isRead && (
            <div className="flex gap-1 items-center">
              <div className="h-3 w-3 rounded-full bg-accent"></div>
            </div>
          )}
        </div> */}
        <div className="flex flex-row space-x-5 px-4 py-5 w-full">
          <div
            className={cn("pl-2 flex flex-col items-center gap-1", {
              "text-accent": !isRead,
            })}
          >
            <Avatar className={cn("h-8 w-8", taskProperties.iconColor)}>
              <AvatarImage src={imageUrl} alt="User Avatar" />
              <AvatarFallback className="bg-base-100">
                {(icon && <div className="w-6">{icon}</div>) || (
                  <Avvvatars value={title} style="shape" />
                )}
              </AvatarFallback>
            </Avatar>
            <div className="text-xs text-slate-500 lowercase">
              {taskProperties.formattedType}
            </div>
          </div>
          <div className="flex flex-col space-y-2 items-start w-full">
            <div className="flex flex-row justify-between w-full">
              <h1 className="capitalize text-sm">
                {title.toLocaleLowerCase()}
              </h1>
              {canReattempt && (
                <div className="flex space-x-1 text-xs text-slate-300 items-center">
                  <PuzzlePieceIcon className="w-[14px]" />
                  <div className="">{attemptCount}</div>
                </div>
              )}
            </div>
            <div className="flex flex-row justify-between w-full">
              <div className=" text-slate-500 text-xs flex space-x-2">
                <div>
                  {defaultChatSubmitted && !canReattempt ? (
                    <div className="text-primary">
                      {defaultChatSubmitted ? "Submitted" : ""}
                    </div>
                  ) : (
                    format(new Date(createdAt), "dd MMM, h:mm a")
                  )}
                </div>
                <div>{!isActive && <span className="">Inactive</span>}</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
