type ReportProps = {
  params: {
    classId: string;
    testBotId: string;
    studentBotId: string;
  };
};
import { type Message } from "ai/react";

import { ChatList } from "@/components/chat/chat-list";
import {
  getDefaultChatMessagesByStudentBotId,
  getUserImageByStudentBotId,
} from "../../../../queries";

export default async function Report({ params }: ReportProps) {
  const { classId, testBotId, studentBotId } = params;
  const userImage = await getUserImageByStudentBotId(studentBotId);
  const messages: Message[] =
    await getDefaultChatMessagesByStudentBotId(studentBotId);
  return (
    <div className="pb-20">
      <ChatList
        messages={messages}
        botImage={"/chubbi.png"}
        studentImage={userImage!}
      />
    </div>
  );
}
