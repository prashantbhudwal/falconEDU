import ChatCard from "../../components/chat-card";
import { StudentBotNavbar } from "../../components/student-navbar";
import { getBotByBotId, getChatsByBotId } from "../../queries";

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
    <>
      <StudentBotNavbar
        botName={bot?.BotConfig.name!}
        teacherName={bot?.name!}
        avatarUrl={bot?.BotConfig.teacher.User.image!}
      />
      {chats.map((chat) => (
        <ChatCard key={chat.id} chat={chat} />
      ))}
    </>
  );
}
