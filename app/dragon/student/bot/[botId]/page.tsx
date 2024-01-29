import { StudentNavbar } from "../../components/student-navbar";
import { getBotByBotId, getChatsByBotId } from "../../queries";
import { ItemCard } from "../../components/item-card";
import Link from "next/link";
import { getStudentBotChatURL, studentHomeURL } from "@/lib/urls";
import { NewAttemptButton } from "./new-attempt-btn";
import { format } from "date-fns";
import { AvatarImage, Avatar, AvatarFallback } from "@/components/ui/avatar";
import Avvvatars from "avvvatars-react";
import { PuzzlePieceIcon } from "@heroicons/react/24/solid";

type BotPageProps = {
  params: {
    botId: string;
  };
};
export default async function BotPageProps({ params }: BotPageProps) {
  const botId = params.botId;
  const chats = await getChatsByBotId(botId);
  const bot = await getBotByBotId(botId);
  const attemptCount = chats?.length ?? 0;

  if (!chats) {
    return (
      <>
        <h1>Oops...No chats found. Ask a teacher to assign you a chat.</h1>
      </>
    );
  }

  return (
    <div className="custom-scrollbar h-screen overflow-y-auto">
      <AttemptsNavbar
        title={bot?.BotConfig.name!}
        subtitle={bot?.BotConfig.teacher.User.name!}
        botId={botId}
        attemptCount={attemptCount}
      />
      <div className="h-full">
        {chats
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .map((chat) => (
            <Link
              href={getStudentBotChatURL(chat.bot.id, chat.id)}
              key={chat.id}
            >
              <ItemCard
                description={format(new Date(chat.createdAt), "dd MMM, h:mm a")}
                title={"Attempt " + chat.attemptNumber.toString()}
                isSubmitted={chat.isSubmitted}
              />
            </Link>
          ))}
      </div>
    </div>
  );
}

const AttemptsNavbar = ({
  title,
  subtitle,
  avatarUrl,
  botId,
  attemptCount,
}: {
  title: string;
  subtitle?: string;
  avatarUrl?: string;
  botId: string;
  attemptCount: number;
}) => {
  return (
    <StudentNavbar>
      <Link href={studentHomeURL} className="navbar-start flex gap-3 pl-6">
        <div className="flex flex-col gap-2">
          <p className="truncate ">{title}</p>
          <div className="flex items-center space-x-1 text-xs text-secondary">
            <PuzzlePieceIcon className="w-[14px]" />
            <div className="">
              {attemptCount}
              {attemptCount > 1 ? " Attempts" : " Attempt"}
            </div>
          </div>
        </div>
      </Link>
      <div className="navbar-end relative flex gap-4">
        <NewAttemptButton
          botId={botId}
          className="fixed bottom-10 right-10 z-50"
        />
      </div>
    </StudentNavbar>
  );
};
