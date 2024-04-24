"use client";
import { getStudentBotChatURL } from "@/lib/urls";
import Link from "next/link";
import { ItemCard } from "../../components/item-card";
import { format } from "date-fns";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { ChatsByBotId } from "@/lib/routers/student/botChat";
import { TestOverflow } from "@/components/testing/test-overflow";

interface AttemptsListProps {
  chats: ChatsByBotId;
}

const AttemptsList: React.FC<AttemptsListProps> = ({ chats }) => {
  const [parent] = useAutoAnimate();
  return (
    <div ref={parent} className="scrollbar-xs overflow-y-auto">
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
