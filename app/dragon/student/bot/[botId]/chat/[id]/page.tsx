import { Message } from "ai/react";
import { getStudentChatApiURL } from "@/lib/urls";
import { getStudentTeacherURL } from "@/lib/urls";
import {
  getBotByBotId,
  getBotChatByChatId,
  getBotConfigByChatId,
} from "@/app/dragon/student/queries";
import { Chat } from "@/components/chat/chat-dragon";
import { AvatarNavbar } from "@/app/dragon/student/components/student-navbar";
import SubmitTestButton from "./submit-test-btn";
import { getDefaultChatMessagesByStudentBotId } from "@/app/dragon/teacher/class/[classId]/tests/queries";

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
  const teacherId = bot?.BotConfig.teacherId;
  const redirectUrl = getStudentTeacherURL(teacherId!);
  const botImage = chat?.botImage;
  const initialMessages: Message[] = chat?.messages || [];
  const emptyMessage =
    bot?.BotConfig.type === "test"
      ? "Say hello to start the test"
      : "Start chatting with your teacher";

  const { messages, id: botChatId } =
    await getDefaultChatMessagesByStudentBotId(botId);

  return (
    <>
      <AvatarNavbar
        title={bot?.BotConfig.name!}
        subtitle={bot?.BotConfig.type}
        button={
          bot?.BotConfig.type === "test" && !bot?.isSubmitted ? (
            <SubmitTestButton
              testBotId={botId}
              messages={messages}
              botChatId={botChatId}
              redirectUrl={redirectUrl}
            />
          ) : (
            <></>
          )
        }
      />
      <Chat
        initialMessages={initialMessages}
        id={id}
        apiPath={getStudentChatApiURL()}
        emptyMessage={emptyMessage}
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
