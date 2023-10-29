import { type Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getChat } from "../../actions";
import { Chat } from "../../../../../components/chat/chat";

export interface ChatPageProps {
  params: {
    id: string;
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user || !session?.user?.id) {
    redirect(`/`);
  }

  const chat = await getChat(params.id, session.user.id);

  if (!chat) {
    notFound();
  }

  if (chat?.userId !== session?.user?.id) {
    notFound();
  }

  return <Chat id={chat.id} initialMessages={chat.messages} />;
}
