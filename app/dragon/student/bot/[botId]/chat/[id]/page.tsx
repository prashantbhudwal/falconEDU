"use client";
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
import { json } from "stream/consumers";
import { getTaskProperties } from "@/app/dragon/teacher/utils";
import { TaskType } from "@/types/dragon";
import { setIsReadToTrue } from "./mutations";
import { Suspense, useEffect, useState } from "react";
import Loading from "../../../../../../loading";
import { usePathname, useRouter } from "next/navigation";
import usePageUnloadGuard from "@/hooks/usePageUnloadGuard";

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

export default function ChatPage({ params }: ChatPageProps) {
  const id = params.id;
  const botId = params.botId;
  const [redirectUrl, setRedirectUrl] = useState("");
  const [classDetails, setClassDetails] = useState<GetClassByBotId>();
  const [emptyMessage, setEmptyMessage] = useState("");
  const [context, setContext] = useState("");
  const [bot, setBot] = useState<GetBotByBotId>();
  const [chat, setChat] = useState<BotChatByChatId>();
  const [loading, setLoading] = useState(false);
  const [dataFetchedSuccessfully, setDataFetchedSuccessfully] = useState(false);
  // const listener = usePageUnloadGuard();

  // listener.onBeforeUnload = () => false;

  useEffect(() => {
    const fetchData = async () => {
      // db name on every variable end stands for database cause of the same naming for state variables
      try {
        setLoading(true);
        const chatDb = await getBotChatByChatId(id);
        setChat(chatDb);
        if (chatDb?.isRead === false) {
          await setIsReadToTrue(chatDb.botChatId);
        }
        const botDb = await getBotByBotId(botId);
        setBot(botDb);
        const teacherId = botDb?.BotConfig.teacherId;
        const redirectUrl = getStudentTeacherURL(teacherId!);
        setRedirectUrl(redirectUrl);
        // const botImage = chat?.botImage;
        // const initialMessages: Message[] = chat?.messages || [];
        const classDetailsDb = await getClassByBotId({ botId });
        setClassDetails(classDetailsDb);
        const type = botDb?.BotConfig.type as TaskType;
        const emptyMessageDb = getTaskProperties(type).emptyChatMessage;
        setEmptyMessage(emptyMessageDb);
        const contextDb = await getChatContext(type, id);
        setContext(contextDb);
        setLoading(false);
        setDataFetchedSuccessfully(true);
      } catch (err) {
        console.log(err);
        setDataFetchedSuccessfully(false);
        setLoading(false);
      }
    };
    fetchData();

    return () => {};
  }, [botId, id, dataFetchedSuccessfully]);

  // useEffect(() => {
    // const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    //   event.preventDefault();
    // Chrome requires returnValue to be set.
    // event.returnValue = "";
    // };

    // const handlePopState = (event: PopStateEvent) => {
    //   event.preventDefault();
    //   window.confirm("Are you sure you want to leave?");
    // Show your custom modal here
    // You can use this event to handle navigation within the same tab
    // };

    // const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    //   const message = "Your custom warning message";

    //   // Display a confirmation dialog
    //   if (!window.confirm(message)) {
    //     // User canceled, prevent navigation
    //     event.preventDefault();
    //     event.returnValue = message; // Standard for most browsers
    //     return message; // For some older browsers
    //   }
    // };

    // const handlePopState = (event: PopStateEvent) => {
    //   const message = "Your custom warning message";

    //   // Display a confirmation dialog
    //   if (!window.confirm(message)) {
    //     // User canceled, prevent navigation
    //     event.preventDefault();
    //     return message;
    //   }
    // };

    // window.addEventListener("beforeunload", handleBeforeUnload);
    // window.addEventListener("popstate", handlePopState);

    // Cleanup when component unmounts.
    // return () => {
      // window.removeEventListener("beforeunload", handleBeforeUnload);
      // window.removeEventListener("popstate", handlePopState);
    // };
  // }, [dataFetchedSuccessfully]);

  return (
    <>
      {loading && <Loading />}
      {!loading && (
        <>
          <AvatarNavbar
            title={bot?.BotConfig.name!}
            subtitle={bot?.BotConfig.type}
            timeLimit={bot?.BotConfig.timeLimit || undefined}
            testBotId={botId}
            redirectUrl={redirectUrl}
            isSubmitted={bot?.isSubmitted}
            button={
              bot?.BotConfig.type === "test" && !bot?.isSubmitted ? (
                <SubmitTestButton testBotId={botId} redirectUrl={redirectUrl} />
              ) : (
                <></>
              )
            }
          />
          {dataFetchedSuccessfully ? (
            <Chat
              initialMessages={chat?.messages || []}
              id={id}
              apiPath={getStudentChatApiURL()}
              emptyMessage={emptyMessage}
              chatBody={{
                chatId: id,
                context,
                type: bot?.BotConfig.type,
              }}
              botImage={chat?.botImage}
              isDisabled={!classDetails?.isActive || !bot?.BotConfig.isActive}
              isSubmitted={bot?.isSubmitted}
              type={bot?.BotConfig.type ?? "chat"}
            />
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
}
