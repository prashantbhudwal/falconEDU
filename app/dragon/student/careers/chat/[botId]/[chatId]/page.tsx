import { Message } from "ai/react";
import { getStudentChatApiURL, getStudentTeacherURL, url } from "@/lib/urls";
import { Chat } from "@/components/chat/chat-dragon";
import { AvatarNavbar } from "@/app/dragon/student/components/student-navbar";
import { revalidatePath } from "next/cache";
import { getTaskProperties } from "@/lib/helpers";
import { TaskType } from "@/types/dragon";
import Link from "next/link";
import { trackEvent } from "@/lib/mixpanel";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { getChatContext } from "@/app/dragon/student/bot/[botId]/chat/[id]/get-context";
import { MediaAccordion } from "@/app/dragon/student/bot/[botId]/chat/[id]/components/media-accordion";
import { constructDigitalOceanUrl } from "@/lib/utils";
import { HostedImage } from "@prisma/client";
import { db } from "@/lib/routers";

export interface ChatPageProps {
  params: {
    chatId: string;
    botId: string;
  };
}

const getImageUrlWithFallback = (avatar: HostedImage | null | undefined) => {
  if (!avatar) {
    return "/chubbi.png";
  }
  const bucket = avatar?.bucket ?? "";
  const key = avatar?.key ?? "";
  return constructDigitalOceanUrl({ bucket, key });
};

export default async function ChatPage({ params }: Readonly<ChatPageProps>) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  const { chatId: id, botId } = params;
  const chat = await db.student.botChat.getBotChatByChatId(id);
  const initialMessages: Message[] = chat?.messages || [];
  const avatar = chat?.avatar;
  const url = getImageUrlWithFallback(avatar);

  if (chat?.isRead === false) {
    await db.student.botChat.setIsReadToTrue(chat.botChatId);
    revalidatePath("/");
  }

  const bot = await db.student.bot.getBotByBotId(botId);
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
  const classDetails = await db.student.class.getClassByBotId({ botId });
  const showSubmit = !chat?.isSubmitted;
  const isDisabled = !classDetails?.isActive || !bot?.BotConfig?.isActive;
  const isSubmitted = chat?.isSubmitted;
  trackEvent("student", "task_viewed", {
    distinct_id: email as string,
    task_type: type,
    task_id: botId,
    attempt_id: id,
  });

  const isCheckable = type === "test" || type === "ai-test";
  const showResults = isSubmitted && autoCheck && isCheckable;
  const formattedType = getTaskProperties(type).formattedTypeStudent;
  return (
    <div className="w-full">
      <div className="">
        <AvatarNavbar
          title={bot?.BotConfig?.name!}
          subtitle={"AI Guide"}
          timeLimit={bot?.BotConfig?.timeLimit ?? undefined}
          testBotId={botId}
          redirectUrl={"/dragon/student/careers"}
          isSubmitted={chat?.isSubmitted}
          isMultipleChats={bot?.BotConfig?.canReAttempt}
          botChatId={id}
          avatarUrl={url}
          //   button={
          //     showSubmit && (
          //       <SubmitTestButton
          //         testBotId={botId}
          //         botChatId={id}
          //         redirectUrl={redirectUrl}
          //         isMultipleChats={bot?.BotConfig?.canReAttempt}
          //         type={type}
          //         autoCheck={autoCheck}
          //       />
          //     )
          //   }
        />
        {showResults && <ResultSection botId={botId} chatId={id} />}
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
        botImage={url ?? "/chubbi.png"}
        isDisabled={isDisabled}
        isSubmitted={isSubmitted}
        type={type ?? "chat"}
        taskId={botId}
        maxMessages={50}
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
