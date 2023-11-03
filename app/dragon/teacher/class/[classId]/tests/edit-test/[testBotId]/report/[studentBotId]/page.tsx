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
import { getTestChatContextByChatId } from "@/app/dragon/student/api/chat/queries";
import testResult from "./testResults";
import PieChartComponent from "./pieChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function Report({ params }: ReportProps) {
  const { classId, testBotId, studentBotId } = params;
  const userImage = await getUserImageByStudentBotId(studentBotId);
  const { messages, id } =
    await getDefaultChatMessagesByStudentBotId(studentBotId);

  const { report } = messages ? await testResult(id, messages) : null;

  return (
    <div className="w-full overflow-y-scroll custom-scrollbar pt-10">
      <Tabs defaultValue="report">
        <TabsList className="grid w-2/5 grid-cols-2 mx-auto bg-base-100">
          <TabsTrigger value="report">Report</TabsTrigger>
          <TabsTrigger value="fullResponse">Full Response</TabsTrigger>
        </TabsList>
        <TabsContent value="report">
          <Paper
            variant={"gray"}
            className="w-full max-w-5xl min-h-screen pb-20"
          >
            {!messages.length || !studentBotId ? (
              <div className="text-center text-lg ">
                The student has not attempted the test yet!
              </div>
            ) : (
              <>
                {report ? (
                  <>
                    <h1 className="text-3xl text-center font-semibold ">
                      Report
                    </h1>
                    <div className="h-[200px] flex justify-center w-full gap-10 my-20">
                      <PieChartComponent report={report} />
                    </div>
                  </>
                ) : (
                  <div className="text-center text-lg ">
                    Can&apos;t generate report . Try again later...
                  </div>
                )}
              </>
            )}
          </Paper>
        </TabsContent>
        <TabsContent value="fullResponse">
          <Paper
            variant={"gray"}
            className="w-full max-w-5xl min-h-screen pb-20"
          >
            <ChatList
              messages={messages}
              botImage={"/chubbi.png"}
              studentImage={userImage!}
            />
          </Paper>
        </TabsContent>
      </Tabs>
    </div>
  );
}
