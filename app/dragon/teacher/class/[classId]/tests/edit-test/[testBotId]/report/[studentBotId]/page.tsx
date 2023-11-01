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
import { Paper } from "@/components/ui/paper";

export default async function Report({ params }: ReportProps) {
  const { classId, testBotId, studentBotId } = params;
  const userImage = await getUserImageByStudentBotId(studentBotId);
  const messages: Message[] =
    await getDefaultChatMessagesByStudentBotId(studentBotId);
  return (
    <div className="w-full overflow-y-scroll custom-scrollbar pt-10">
      <Paper variant={"gray"} className="w-full max-w-5xl pb-20">
        {!messages.length ? (
          <div>The student has not attempted the test yet!</div>
        ) : (
          <ChatList
            messages={messages}
            botImage={"/chubbi.png"}
            studentImage={userImage!}
          />
        )}
      </Paper>
    </div>
  );
}
