import { AvatarNavbar } from "../../components/student-navbar";
import { getBotByBotId, getChatsByBotId } from "../../queries";
import { ItemCard } from "../../components/item-card";
import Link from "next/link";
import { getStudentBotChatURL } from "@/lib/urls";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { db } from "@/app/dragon/teacher/routers";
import { NewChatButton } from "./new-chat-btn";
import getDate from "date-fns/getDate";
import { format } from "date-fns";

type BotPageProps = {
  params: {
    botId: string;
  };
};
export default async function BotPageProps({ params }: BotPageProps) {
  const botId = params.botId;
  const chats = await getChatsByBotId(botId);
  const bot = await getBotByBotId(botId);

  if (!chats) {
    return (
      <>
        <h1>Oops...No chats found. Ask a teacher to assign you a chat.</h1>
      </>
    );
  }

  return (
    <div className="h-screen overflow-y-auto custom-scrollbar">
      <AvatarNavbar
        title={bot?.BotConfig.name!}
        subtitle={bot?.BotConfig.teacher.User.name!}
        button={<NewChatButton botId={botId} />}
      />
      <div className="h-full">
        {chats
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((chat) => (
            <Link
              href={getStudentBotChatURL(chat.bot.id, chat.id)}
              key={chat.id}
            >
              <ItemCard
                description={format(new Date(chat.createdAt), "PPpp")}
                title={"Attempt " + chat.attemptNumber.toString()}
              />
            </Link>
          ))}
      </div>
    </div>
  );
}
