import { Message } from "ai/react";
import { getStudentChatApiURL } from "@/lib/urls";
import {
  getBotChatByChatId,
  getBotConfigByChatId,
} from "@/app/dragon/student/queries";
import { Chat } from "@/components/chat/chat-dragon";
export interface ChatPageProps {
  params: {
    id: string;
    botId: string;
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const id = params.id;
  const botId = params.botId;
  const botConfig = await getBotConfigByChatId(id);
  const chat = await getBotChatByChatId(id);
  const initialMessages: Message[] = chat?.messages || [];
  console.log("initialMessages", initialMessages);

  return (
    <div className="overflow-y-scroll custom-scrollbar">
      <Chat
        initialMessages={initialMessages}
        id={id}
        apiPath={getStudentChatApiURL()}
        emptyMessage={"Start chatting with your teacher"}
        chatBody={{
          chatId: id,
          botConfig: botConfig,
        }}
      />
    </div>
  );
}
