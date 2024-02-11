import { ChatList } from "@/components/chat/chat-list";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { getChatMessagesByBotChatId } from "../[taskId]/test/queries";

type ChatResponseProps = {
  attemptId: string;
};

export async function FullChat({ attemptId }: ChatResponseProps) {
  const { messages, id, userImage } = await getChatMessagesByBotChatId({
    botChatId: attemptId,
  });

  if (!messages)
    return <h1 className="text-lg">Submitted without responding!</h1>;
  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full flex-col place-content-center">
          <Image src="/chubbi.png" alt="Chubbi" width={100} height={100} />
        </div>
      }
    >
      <ChatList
        messages={messages}
        botImage={"/chubbi.png"}
        studentImage={userImage}
        attemptId={id}
        taskId={"teacher-side"}
        type="test"
      />
    </Suspense>
  );
}
