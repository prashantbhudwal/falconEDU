import ChatCard from "../../components/chat-card";
import { AvatarNavbar } from "../../components/student-navbar";
import { getBotByBotId, getChatsByBotId } from "../../queries";
import { ItemCard } from "../../components/item-card";
import Link from "next/link";
import { getStudentBotChatURL } from "@/lib/urls";
import { redirect } from "next/navigation";

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

  //TODO FIX: Remove this redirect and just move to default chat
  const defaultChat = chats.find((chat) => chat.isDefault);

  if (defaultChat) {
    redirect(getStudentBotChatURL(defaultChat.bot.id, defaultChat.id));
  }

  return (
    <>
      <AvatarNavbar
        title={bot?.BotConfig.name!}
        subtitle={bot?.BotConfig.teacher.User.name!}
      />
      {chats.map((chat) => (
        <Link href={getStudentBotChatURL(chat.bot.id, chat.id)} key={chat.id}>
          <ItemCard title={chat.bot.name!} description={chat.bot.name!} />
        </Link>
      ))}
    </>
  );
}
