import { Message } from "ai/react";
import { getStudentChatApiURL } from "@/lib/urls";
import { getStudentTeacherURL } from "@/lib/urls";
import {
  getBotByBotId,
  getBotChatByChatId,
  getClassByBotId,
} from "@/app/dragon/student/queries";
import { Chat } from "@/components/chat/chat-dragon";
import { AvatarNavbar } from "@/app/dragon/student/components/student-navbar";
import SubmitTestButton from "./submit-test-btn";
import prisma from "@/prisma";
import { revalidatePath } from "next/cache";
import { getTestQuestionsByBotChatId } from "@/app/dragon/student/api/chat/prompts/test-prompts/testBotMessages";
import { getChatContextByChatId } from "@/app/dragon/student/api/chat/prompts/chat-prompts/queries";
import { json } from "stream/consumers";

export interface ChatPageProps {
  params: {
    id: string;
    botId: string;
  };
}

const setIsReadToTrue = async function (botChatId: string) {
  const botChat = await prisma.botChat.findFirst({
    where: {
      id: botChatId,
    },
  });

  if (botChat?.isRead) {
    return;
  }

  try {
    await prisma.botChat.update({
      where: {
        id: botChatId,
      },
      data: {
        isRead: true,
      },
    });
  } catch (error) {
    console.error("Error updating Chat Status.", error);
    throw new Error("Failed to update Chat Status");
  }
};
export default async function ChatPage({ params }: ChatPageProps) {
  const id = params.id;
  const botId = params.botId;
  const chat = await getBotChatByChatId(id);
  if (chat?.isRead === false) {
    await setIsReadToTrue(chat.botChatId);
    revalidatePath("/");
  }
  const bot = await getBotByBotId(botId);
  const teacherId = bot?.BotConfig.teacherId;
  const redirectUrl = getStudentTeacherURL(teacherId!);
  const botImage = chat?.botImage;
  const initialMessages: Message[] = chat?.messages || [];
  const classDetails = await getClassByBotId({ botId });
  const emptyMessage =
    bot?.BotConfig.type === "test"
      ? "Say hello to start the test"
      : "Start chatting with your teacher";

  let context;

  if (bot?.BotConfig.type === "test") {
    const parsedQuestions = await getTestQuestionsByBotChatId(id);
    context = JSON.stringify(parsedQuestions);
  } else {
    const chatContext = await getChatContextByChatId(id);
    context = JSON.stringify(chatContext);
  }

  return (
    <>
      <AvatarNavbar
        title={bot?.BotConfig.name!}
        subtitle={bot?.BotConfig.type}
        button={
          bot?.BotConfig.type === "test" && !bot?.isSubmitted ? (
            <SubmitTestButton testBotId={botId} redirectUrl={redirectUrl} />
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
          context,
          type: bot?.BotConfig.type,
        }}
        botImage={botImage}
        isDisabled={!classDetails?.isActive || !bot?.isActive}
        isSubmitted={bot?.isSubmitted}
      />
    </>
  );
}
