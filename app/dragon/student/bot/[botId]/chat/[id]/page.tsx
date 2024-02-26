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
import { getTaskProperties } from "@/app/dragon/teacher/utils";
import { TaskType } from "@/types/dragon";
import { setIsReadToTrue } from "./mutations";
import Link from "next/link";
import { getChatContext } from "./get-context";
import { MediaAccordion } from "./components/media-accordion";
import { trackEvent } from "@/lib/mixpanel";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";

export interface ChatPageProps {
  params: {
    id: string;
    botId: string;
  };
}

export default async function ChatPage({ params }: Readonly<ChatPageProps>) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
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
  const { stringifiedContext: context, autoCheck } = await getChatContext({
    type,
    chatId: id,
  });
  const teacherId = bot?.BotConfig?.teacherId;
  if (!teacherId) {
    throw new Error("Teacher not found");
  }
  const redirectUrl = getStudentTeacherURL(teacherId);
  const classDetails = await getClassByBotId({ botId });
  const showSubmit = !chat?.isSubmitted && ["test", "ai-test"].includes(type);
  const isDisabled = !classDetails?.isActive || !bot?.BotConfig?.isActive;
  const isSubmitted = chat?.isSubmitted;
  trackEvent("student", "task_viewed", {
    distinct_id: email as string,
    task_type: type,
    task_id: botId,
    attempt_id: id,
  });

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
          autoCheck={autoCheck}
        />
      )
    );
  };
  const showResults = isSubmitted && (autoCheck || autoCheck === undefined);
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
        {showResults && <ResultSection botId={botId} chatId={id} />}
        {/* <div className="fixed bottom-40 left-1/2 z-10 w-fit -translate-x-1/2 rounded-xl">
          <SubmitButton variant="outline" />
        </div> */}
        <MediaAccordion attemptId={id} type={type} className="m-2" />
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
        type={type ?? "chat"}
        taskId={botId}
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
      <div className="w-full rounded-md bg-gradient-to-b from-base-200 to-base-300 py-2 text-center">
        <div className="group relative mx-auto w-fit">
          <div className="absolute -inset-0.5 animate-tilt rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 opacity-75 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200"></div>
          <Link href={resultUrl}>
            <div className="relative rounded-xl bg-base-300 px-6 py-3">
              See Results
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
