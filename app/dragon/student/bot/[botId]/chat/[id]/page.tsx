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
import { getTestQuestionsByBotChatId } from "@/app/dragon/ai/student-chat/prompts/test-prompts/testBotMessages";
import { getChatContextByChatId } from "@/app/dragon/ai/student-chat/prompts/chat-prompts/queries";
import { getLessonContextByChatId } from "@/app/dragon/ai/student-chat/prompts/lesson-prompts/queries";
import { json } from "stream/consumers";
import { getTaskProperties } from "@/app/dragon/teacher/utils";
import { TaskType } from "@/types/dragon";

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

const getChatContext = async function (type: TaskType, chatId: string) {
  switch (type) {
    case "chat":
      const parsedQuestions = await getTestQuestionsByBotChatId(chatId);
      return JSON.stringify(parsedQuestions);
    case "test":
      const chatContext = await getChatContextByChatId(chatId);
      return JSON.stringify(chatContext);
    case "lesson":
      const lessonContext = await getLessonContextByChatId(chatId);
      return JSON.stringify(lessonContext);
    default:
      throw new Error("Invalid type");
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
  const type = bot?.BotConfig.type as TaskType;
  const emptyMessage = getTaskProperties(type).emptyChatMessage;
  const context = await getChatContext(type, id);

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
          type,
        }}
        botImage={botImage}
        isDisabled={
          !classDetails?.isActive || !bot?.isActive || !bot?.BotConfig.published
        }
        isSubmitted={bot?.isSubmitted}
        type={type ?? "chat"}
      />
    </>
  );
}
