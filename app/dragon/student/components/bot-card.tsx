import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Avvvatars from "avvvatars-react";
import Link from "next/link";

type BotCardProps = {
  bot: any;
  href: string;
};
export default function BotCard({ bot, href }: BotCardProps) {
  return (
    <Link href={href}>
      <Card className="flex flex-row max-w-sm space-x-5 p-4">
        <Avatar>
          <AvatarImage src="/chubbi.png" alt="Falcon Logo" />
          <AvatarFallback>
            <Avvvatars value="John Doe" style="character" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col space-y-2">
          <h1 className="text-xl font-bold">John Doe</h1>
          <p className="text-sm text-gray-500">@johndoe</p>
        </div>
      </Card>
    </Link>
  );
}
