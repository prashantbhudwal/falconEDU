import ChatCard from "../../components/chat-card";
import { StudentBotItemNav } from "../../components/student-navbar";
import { getBotConfigByBotId, getChatsByBotId } from "../../queries";

type BotPageProps = {
  params: {
    botId: string;
  };
};
export default async function BotPageProps({ params }: BotPageProps) {
  const botId = params.botId;
  const chats = await getChatsByBotId(botId);
  const botConfig = await getBotConfigByBotId(botId);

  if (!chats) {
    return (
      <>
        <h1>Oops...No chats found. Ask a teacher to assign you a chat.</h1>
      </>
    );
  }
  return (
    <>
      <StudentBotItemNav
        ItemName={botConfig?.BotConfig.name!}
        TeacherName={botConfig?.name!}
        avatarUrl={""}
      />
      {chats.map((chat) => (
        <ChatCard key={chat.id} chat={chat} />
      ))}
    </>
  );
}
