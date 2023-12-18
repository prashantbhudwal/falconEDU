import { ChatList } from "@/components/chat/chat-list";
import { getDefaultChatMessagesByStudentBotId } from "../[taskId]/test/queries";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

type ChatResponseProps = {
  studentBotId: string;
};

export async function FullChat({ studentBotId }: ChatResponseProps) {
  const { messages, id, userImage } =
    await getDefaultChatMessagesByStudentBotId(studentBotId);
  if (!messages)
    return <h1 className="text-lg">Submitted without responding!</h1>;
  return (
    <Suspense
      fallback={
        <div className="flex flex-col w-full h-full place-content-center">
          <Image src="/chubbi.png" alt="Chubbi" width={100} height={100} />
        </div>
      }
    >
      <ChatList
        messages={messages}
        botImage={"/chubbi.png"}
        studentImage={userImage}
      />
    </Suspense>
  );
}
