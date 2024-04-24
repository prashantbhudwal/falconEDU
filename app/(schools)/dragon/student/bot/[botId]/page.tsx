import { StudentNavbar } from "../../components/student-navbar";
import Link from "next/link";
import { studentHomeURL } from "@/lib/urls";
import { NewAttemptButton } from "./new-attempt-btn";
import { PuzzlePieceIcon } from "@heroicons/react/24/solid";
import AttemptsList from "./attempts-list";
import { db } from "@/lib/routers";

type BotPageProps = {
  params: {
    botId: string;
  };
};
export default async function BotPageProps({ params }: BotPageProps) {
  const botId = params.botId;
  const chats = await db.student.botChat.getChatsByBotId(botId);
  const bot = await db.student.bot.getBotByBotId(botId);
  const attemptCount = chats?.length ?? 0;

  if (!chats) return <NoChats />;

  return (
    <div className="scrollbar-xs h-screen overflow-y-auto">
      <AttemptsNavbar
        title={bot?.BotConfig?.name ?? "Bot"}
        subtitle={bot?.BotConfig?.teacher?.User?.name ?? "Teacher"}
        botId={botId}
        attemptCount={attemptCount}
      />
      <AttemptsList chats={chats} />
    </div>
  );
}

const AttemptsNavbar = ({
  title,
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

const NoChats = () => {
  return (
    <div className="mt-10 flex flex-col items-center justify-center">
      <h1 className="mb-4 text-2xl font-bold text-red-600">
        Oops...Nothing found.
      </h1>
      <p className="text-lg text-gray-700">
        Ask a teacher to assign you a task.
      </p>
    </div>
  );
};
