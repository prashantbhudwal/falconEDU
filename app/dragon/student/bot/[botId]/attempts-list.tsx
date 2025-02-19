"use client";
import { getStudentBotChatURL } from "@/lib/urls";
import Link from "next/link";
import { ItemCard } from "../../components/item-card";
import { format } from "date-fns";
import { ChatsByBotId } from "../../queries";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface AttemptsListProps {
  chats: ChatsByBotId;
}

const AttemptsList: React.FC<AttemptsListProps> = ({ chats }) => {
  const [parent] = useAutoAnimate();
  return (
    <div className="h-full" ref={parent}>
      {chats.map((chat) => (
        <Link href={getStudentBotChatURL(chat.bot.id, chat.id)} key={chat.id}>
          <ItemCard
            description={format(new Date(chat.createdAt), "dd MMM, h:mm a")}
            title={"Attempt " + chat.attemptNumber.toString()}
            isSubmitted={chat.isSubmitted}
          />
        </Link>
      ))}
    </div>
  );
};

export default AttemptsList;
