import { Message } from "ai/react";
import { getStudentChatApiURL } from "@/lib/urls";
import {
  getBotByBotId,
  getBotChatByChatId,
  getBotConfigByChatId,
} from "@/app/dragon/student/queries";
import { Chat } from "@/components/chat/chat-dragon";
import { StudentBotItemNavbar } from "@/app/dragon/student/components/student-navbar";

export interface ChatPageProps {
  params: {
    id: string;
    botId: string;
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const id = params.id;
  const botId = params.botId;
  const chat = await getBotChatByChatId(id);
  const bot = await getBotByBotId(botId);
  const botImage = chat?.botImage;
  const initialMessages: Message[] = chat?.messages || [];

  return (
    <>
      <StudentBotItemNavbar
        avatarUrl={""}
        teacherName={bot?.name!}
        itemName="Natural Selection"
      />
      <div className="overflow-y-scroll custom-scrollbar">
        <Chat
          initialMessages={initialMessages}
          id={id}
          apiPath={getStudentChatApiURL()}
          emptyMessage={"Start chatting with your teacher"}
          chatBody={{
            chatId: id,
          }}
          botImage={botImage}
        />
      </div>
    </>
  );
}
