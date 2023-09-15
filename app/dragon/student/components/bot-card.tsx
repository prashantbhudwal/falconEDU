import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Avvvatars from "avvvatars-react";
import Link from "next/link";
import { BotsByUserId } from "../queries";
import type { ArrayElement } from "../queries";
import { getStudentBotURL } from "@/lib/urls";

type BotCardProps = {
  bot: ArrayElement<BotsByUserId>;
};
export default function BotCard({ bot }: BotCardProps) {
  return (
    <Link href={getStudentBotURL(bot.id)}>
      <Card className="flex flex-row max-w-sm space-x-5 p-4">
        <Avatar>
          <AvatarImage
            src={bot.BotConfig.teacher.User.image!}
            alt="Bot Image"
          />
          <AvatarFallback>
            <Avvvatars value={bot.name} style="character" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col space-y-2">
          <h1 className="text-xl font-bold">{bot.name}</h1>
          <p className="text-sm text-gray-500">{bot.BotConfig.name}</p>
        </div>
      </Card>
    </Link>
  );
}
