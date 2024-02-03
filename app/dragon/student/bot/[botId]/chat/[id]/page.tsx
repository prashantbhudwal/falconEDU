import { Message } from "ai/react";
import { getStudentChatApiURL, getStudentTeacherURL, url } from "@/lib/urls";
import {
  getBotChatByChatId,
  getClassByBotId,
  getBotByBotId,
} from "@/app/dragon/student/queries";
import { Chat } from "@/components/chat/chat-dragon";
import { AvatarNavbar } from "@/app/dragon/student/components/student-navbar";
import { SubmitTestButton } from "./submit-test-btn";
import { revalidatePath } from "next/cache";
import { getTestQuestionsByBotChatId } from "@/app/dragon/ai/student-chat/prompts/test/messages";
import { getChatContextByChatId } from "@/app/dragon/ai/student-chat/prompts/chat/queries";
import { getLessonContextByChatId } from "@/app/dragon/ai/student-chat/prompts/lesson/queries";
import { getTaskProperties } from "@/app/dragon/teacher/utils";
import { TaskType } from "@/types/dragon";
import { setIsReadToTrue } from "./mutations";
import { getAITestContextByChatId } from "@/app/dragon/ai/student-chat/prompts/ai-test/queries";
import Link from "next/link";
export interface ChatPageProps {
  params: {
    id: string;
    botId: string;
  };
}

const getChatContext = async function (type: TaskType, chatId: string) {
  switch (type) {
    case "chat": {
      const chatContext = await getChatContextByChatId(chatId);
      return JSON.stringify(chatContext);
    }
    case "test": {
      const parsedQuestions = await getTestQuestionsByBotChatId(chatId);
      return JSON.stringify(parsedQuestions);
    }
    case "lesson": {
      const lessonContext = await getLessonContextByChatId(chatId);
      return JSON.stringify(lessonContext);
    }
    case "ai-test": {
      const aiTestContext = await getAITestContextByChatId(chatId);
      return JSON.stringify(aiTestContext);
    }
    default:
      throw new Error("Invalid type");
  }
};

export default async function ChatPage({ params }: Readonly<ChatPageProps>) {
  const { id, botId } = params;
  const chat = await getBotChatByChatId(id);
  const initialMessages: Message[] = chat?.messages || [];
  const botImage = chat?.botImage;
  if (chat?.isRead === false) {
    await setIsReadToTrue(chat.botChatId);
    revalidatePath("/");
  }
  const bot = await getBotByBotId(botId);
  const type = bot?.BotConfig?.type as TaskType;
  const emptyMessage = getTaskProperties(type).emptyChatMessage;
  const context = await getChatContext(type, id);
  const teacherId = bot?.BotConfig?.teacherId;
  if (!teacherId) {
    throw new Error("Teacher not found");
  }
  const redirectUrl = getStudentTeacherURL(teacherId);
  const classDetails = await getClassByBotId({ botId });
  const showSubmit = !chat?.isSubmitted && ["test", "ai-test"].includes(type);
  const isDisabled = !classDetails?.isActive || !bot?.BotConfig?.isActive;
  const isSubmitted = chat?.isSubmitted;

  const SubmitButton = ({ variant }: { variant: "outline" | "default" }) => {
    const styles =
      variant === "outline"
        ? "rounded-xl w-fit bg-base-200 border hover:bg-base-200 px-5 tracking-wider border-slate-500 text-slate-500"
        : "";

    return (
      showSubmit && (
        <SubmitTestButton
          testBotId={botId}
          className={styles}
          botChatId={id}
          redirectUrl={redirectUrl}
          isMultipleChats={bot?.BotConfig?.canReAttempt}
          type={type}
        />
      )
    );
  };

  return (
    <div className="w-full">
      <div className="">
        <AvatarNavbar
          title={bot?.BotConfig?.name!}
          subtitle={bot?.BotConfig?.type}
          timeLimit={bot?.BotConfig?.timeLimit ?? undefined}
          testBotId={botId}
          redirectUrl={redirectUrl}
          isSubmitted={chat?.isSubmitted}
          isMultipleChats={bot?.BotConfig?.canReAttempt}
          botChatId={id}
          button={<SubmitButton variant="default" />}
        />
        {isSubmitted && <ResultSection botId={botId} chatId={id} />}
        <div className="fixed bottom-20 left-1/2 z-10 w-fit -translate-x-1/2 rounded-xl">
          <SubmitButton variant="outline" />
        </div>
      </div>
      <Chat
        initialMessages={initialMessages}
        id={id}
        apiPath={getStudentChatApiURL()}
        emptyMessage={emptyMessage}
        chatBody={{
          chatId: id,
          context,
          type: bot?.BotConfig?.type,
        }}
        botImage={botImage}
        isDisabled={isDisabled}
        isSubmitted={isSubmitted}
        type={bot?.BotConfig?.type ?? "chat"}
      />
    </div>
  );
}

const ResultSection = ({
  botId,
  chatId,
}: {
  botId: string;
  chatId: string;
}) => {
  const resultUrl = url.student.taskReport({
    botId,
    chatId,
  });
  return (
    <div className="flex justify-center">
      <Link
        href={resultUrl}
        className="w-full rounded-md bg-slate-500 py-2 text-center text-white"
      >
        See Result
      </Link>
    </div>
  );
};
