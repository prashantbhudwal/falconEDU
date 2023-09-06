import Chat from "../../components/chat/chat";
import bots from "../../bot-test-data";

export interface ChatPageProps {
  params: {
    id: string;
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const chat = bots[0];

  return <Chat id={chat.id} initialMessages={chat.messages} />;
}
