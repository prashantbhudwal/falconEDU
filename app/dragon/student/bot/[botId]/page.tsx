import { StudentNavbar } from "../../components/student-navbar";
import { getBotByBotId, getChatsByBotId } from "../../queries";
import { ItemCard } from "../../components/item-card";
import Link from "next/link";
import { getStudentBotChatURL, studentHomeURL } from "@/lib/urls";
import { NewAttemptButton } from "./new-attempt-btn";
import { format } from "date-fns";
import { AvatarImage, Avatar, AvatarFallback } from "@/components/ui/avatar";
import Avvvatars from "avvvatars-react";

type BotPageProps = {
  params: {
    botId: string;
  };
};
export default async function BotPageProps({ params }: BotPageProps) {
  const botId = params.botId;
  const chats = await getChatsByBotId(botId);
  const bot = await getBotByBotId(botId);

  if (!chats) {
    return (
      <>
        <h1>Oops...No chats found. Ask a teacher to assign you a chat.</h1>
      </>
    );
  }

  return (
    <div className="h-screen overflow-y-auto custom-scrollbar">
      <AttemptsNavbar
        title={bot?.BotConfig.name!}
        subtitle={bot?.BotConfig.teacher.User.name!}
        botId={botId}
      />
      <div className="h-full">
        {chats
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((chat) => (
            <Link
              href={getStudentBotChatURL(chat.bot.id, chat.id)}
              key={chat.id}
            >
              <ItemCard
                description={format(new Date(chat.createdAt), "PPpp")}
                title={"Attempt " + chat.attemptNumber.toString()}
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
}: {
  title: string;
  subtitle?: string;
  avatarUrl?: string;
  botId: string;
}) => {
  return (
    <StudentNavbar>
      <Link href={studentHomeURL} className="flex gap-3 navbar-start">
        <Avatar>
          <AvatarImage src={avatarUrl} />
          <AvatarFallback className="bg-base-300">
            <Avvvatars value={title} style="shape" />
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="truncate">{title}</p>
          <p className="text-sm text-text-500 truncate">{subtitle}</p>
        </div>
      </Link>
      <div className="navbar-end flex gap-4 relative">
        <NewAttemptButton
          botId={botId}
          className="fixed bottom-10 right-10 z-50"
        />
      </div>
    </StudentNavbar>
  );
};
