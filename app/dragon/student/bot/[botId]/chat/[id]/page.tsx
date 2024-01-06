import { Message } from "ai/react";
import { getStudentChatApiURL } from "@/lib/urls";
import { getStudentTeacherURL } from "@/lib/urls";
import {
  BotChatByChatId,
  GetClassByBotId,
  GetBotByBotId,
  getBotChatByChatId,
  getClassByBotId,
  getBotByBotId,
} from "@/app/dragon/student/queries";
import { Chat } from "@/components/chat/chat-dragon";
import { AvatarNavbar } from "@/app/dragon/student/components/student-navbar";
import SubmitTestButton from "./submit-test-btn";
import { revalidatePath } from "next/cache";
import { getTestQuestionsByBotChatId } from "@/app/dragon/ai/student-chat/prompts/test-prompts/testBotMessages";
import { getChatContextByChatId } from "@/app/dragon/ai/student-chat/prompts/chat-prompts/queries";
import { getLessonContextByChatId } from "@/app/dragon/ai/student-chat/prompts/lesson-prompts/queries";
import { getTaskProperties } from "@/app/dragon/teacher/utils";
import { TaskType } from "@/types/dragon";
import { setIsReadToTrue } from "./mutations";

export interface ChatPageProps {
  params: {
    id: string;
    botId: string;
  };
}

const getChatContext = async function (type: TaskType, chatId: string) {
  switch (type) {
    case "chat":
      const chatContext = await getChatContextByChatId(chatId);
      return JSON.stringify(chatContext);
    case "test":
      const parsedQuestions = await getTestQuestionsByBotChatId(chatId);
      return JSON.stringify(parsedQuestions);
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

  const SubmitButton = ({ variant }: { variant: "outline" | "default" }) => {
    const styles =
      variant === "outline"
        ? "rounded-xl w-fit bg-base-200 border hover:bg-base-200 px-5 tracking-wider border-slate-500 text-slate-500"
        : "";

    return bot?.BotConfig.type === "test" && !chat?.isSubmitted ? (
      <SubmitTestButton
        testBotId={botId}
        className={styles}
        botChatId={id}
        redirectUrl={redirectUrl}
        isMultipleChats={bot?.BotConfig.canReAttempt}
      />
    ) : (
      <></>
    );
  };

  return (
    <div className="w-full">
      <div className="">
        <AvatarNavbar
          title={bot?.BotConfig.name!}
          subtitle={bot?.BotConfig.type}
          timeLimit={bot?.BotConfig.timeLimit || undefined}
          testBotId={botId}
          redirectUrl={redirectUrl}
          isSubmitted={chat?.isSubmitted}
          isMultipleChats={bot?.BotConfig.canReAttempt}
          botChatId={id}
          button={<SubmitButton variant="default" />}
        />
        <div className="fixed w-fit z-10 bottom-20 left-1/2 -translate-x-1/2 rounded-xl">
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
          type: bot?.BotConfig.type,
        }}
        botImage={botImage}
        isDisabled={!classDetails?.isActive || !bot?.BotConfig.isActive}
        isSubmitted={chat?.isSubmitted}
        type={bot?.BotConfig.type ?? "chat"}
      />
    </div>
  );
}
