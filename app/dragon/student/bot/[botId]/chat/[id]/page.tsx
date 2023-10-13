import { Message } from "ai/react";
import { getStudentChatApiURL } from "@/lib/urls";
import {
  getBotByBotId,
  getBotChatByChatId,
  getBotConfigByChatId,
} from "@/app/dragon/student/queries";
import { Chat } from "@/components/chat/chat-dragon";
import { AvatarNavbar } from "@/app/dragon/student/components/student-navbar";
import SubmitTestButton from "./submit-test-btn";

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
      <AvatarNavbar
        title={bot?.BotConfig.name!}
        subtitle={bot?.BotConfig.type}
        button={
          bot?.BotConfig.type === "test" && !bot?.isSubmitted ? (
            <SubmitTestButton testBotId={botId} />
          ) : (
            <></>
          )
        }
      />
      <Chat
        initialMessages={initialMessages}
        id={id}
        apiPath={getStudentChatApiURL()}
        emptyMessage={"Start chatting with your teacher"}
        chatBody={{
          chatId: id,
        }}
        botImage={botImage}
        isDisabled={!bot?.isActive}
        isSubmitted={bot?.isSubmitted}
      />
    </>
  );
}
