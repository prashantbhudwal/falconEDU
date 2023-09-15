import ChatCard from "../../components/chat-card";
import { getChatsByBotId } from "../../queries";

type BotPageProps = {
  params: {
    botId: string;
  };
};
export default async function BotPageProps({ params }: BotPageProps) {
  const botId = params.botId;
  const chats = await getChatsByBotId(botId);
  if (!chats) {
    return (
      <>
        <h1>Oops...No chats found. Ask a teacher to assign you a chat.</h1>
      </>
    );
  }
  return chats.map((chat) => <ChatCard key={chat.id} chat={chat} />);
}
