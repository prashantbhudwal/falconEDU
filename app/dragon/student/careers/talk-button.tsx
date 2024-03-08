"use client";
import { Button } from "@/components/ui/button";
import { BotConfig, HostedImage } from "@prisma/client";
import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Avvvatars from "avvvatars-react";
import { cn, constructDigitalOceanUrl } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { createBot } from "./create-bot";
import { useRouter } from "next/navigation";
type BotConfigWithHostedImage = BotConfig & { avatar: HostedImage | null };
export function TalkButton({ config }: { config: BotConfigWithHostedImage }) {
  const bucket = config.avatar?.bucket ?? "";
  const key = config.avatar?.key ?? "";
  const url = constructDigitalOceanUrl({ bucket, key });
  const session = useSession();
  const userId = session?.data?.user?.id as string;
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const handleClick = async () => {
    setOpen(true);
    console.log("Creating bot");
    const { newBot, defaultChat } = await createBot(config, userId);
    console.log("Bot created", newBot);
    console.log("Default chat", defaultChat);
    const redirectUrl = `/dragon/student/careers/chat/${newBot.id}/${defaultChat.id}`;
    console.log("Redirecting to", redirectUrl);
    router.push(redirectUrl);
    setOpen(false);
  };

  return (
    <div className="flex w-full flex-col items-center">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex h-2/5 w-4/5 flex-col items-center space-y-3">
          <DialogHeader className="pt-10">
            <DialogTitle>Connecting ... </DialogTitle>
            <DialogDescription> {config.name}</DialogDescription>
          </DialogHeader>
          <Avatar className={cn("h-16 w-16 group-hover:blur-sm")}>
            <AvatarImage src={url} alt="User Avatar" />
            <AvatarFallback className="bg-base-100">
              <Avvvatars value={config.name} style="shape" />
            </AvatarFallback>
          </Avatar>
        </DialogContent>
      </Dialog>
      <Button onClick={handleClick} className="w-2/3">
        Chat
      </Button>
    </div>
  );
}
