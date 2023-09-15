import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Avvvatars from "avvvatars-react";
import Link from "next/link";
import { FiMessageCircle } from "react-icons/fi";
import type { ChatsByBotId } from "../queries";
import type { ArrayElement } from "../queries";
import { getStudentBotChatURL } from "@/lib/urls";

type ChatCardProps = {
  chat: ArrayElement<ChatsByBotId>;
};
export default function BotCard({ chat }: ChatCardProps) {
  return (
    <Link href={getStudentBotChatURL(chat.bot.id, chat.id)}>
      <Card className="flex flex-row max-w-sm space-x-5 p-4">
        <Avatar>
          <AvatarImage src="some-image-url" alt="User Avatar" />
          <AvatarFallback className="bg-base-300 p-2">
            <FiMessageCircle size={32} />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col space-y-2">
          <h1 className="text-xl font-bold">{chat.bot.name}</h1>
          <p className="text-sm text-gray-500">
            {chat.isDefault ? "Default Chat" : "Custom Chat"}
          </p>
        </div>
      </Card>
    </Link>
  );
}
