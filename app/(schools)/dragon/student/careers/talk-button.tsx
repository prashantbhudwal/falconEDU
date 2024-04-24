"use client";
import { Button } from "@/components/ui/button";
import { BotConfig, HostedImage } from "@prisma/client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Avvvatars from "avvvatars-react";
import { cn, constructDigitalOceanUrl } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { createBot } from "./create-bot";
import { useRouter } from "next/navigation";
import { PulseLoader } from "react-spinners";
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
    const { newBot, defaultChat } = await createBot(config, userId);
    const redirectUrl = `/dragon/student/careers/chat/${newBot.id}/${defaultChat.id}`;
    router.push(redirectUrl);
  };

  return (
    <div className="flex w-full flex-col items-center">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex h-2/5 w-4/5 flex-col items-center space-y-3 border-fuchsia-950">
          <DialogHeader className="pt-10">
            <DialogTitle>
              <div className="flex animate-pulse flex-row items-baseline gap-1">
                <div>Connecting</div>
                <PulseLoader size={4} color={"#059669"} speedMultiplier={0.5} />
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-5">
            <Avatar
              className={cn(
                "h-20 w-20 animate-pulse ring ring-fuchsia-900 group-hover:blur-sm",
              )}
            >
              <AvatarImage src={url} alt="User Avatar" />
              <AvatarFallback className="bg-base-100">
                <Avvvatars value={config.name} style="shape" />
              </AvatarFallback>
            </Avatar>
            <DialogTitle>{config.name}</DialogTitle>
          </div>
        </DialogContent>
      </Dialog>
      <Button onClick={handleClick} className="w-2/3">
        Chat
      </Button>
    </div>
  );
}
