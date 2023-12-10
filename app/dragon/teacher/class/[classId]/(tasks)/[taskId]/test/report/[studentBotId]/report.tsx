import { Paper } from "@/components/ui/paper";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TestResultsByBotId,
  getTestResultsByBotId,
} from "@/app/dragon/teacher/queries";
import {
  AllStudentResponsesByBotConfigId,
  getAllQuestionResponsesByBotConfigId,
  getDefaultChatMessagesByStudentBotId,
  getSingleStudentByStudentBotId,
  getStudentsByBotConfigId,
  getUserImageByStudentBotId,
} from "../../queries";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import PieChartComponent from "./pieChart";
import { Progress } from "@/components/progress";
import { ChatList } from "@/components/chat/chat-list";
import { Separator } from "@/components/ui/separator";
import { ReportTable } from "./report-table";
import { ReportHistogram } from "./report-histogram";
import { QuestionList } from "./question-list";

export default async function Report({
  params,
}: {
  params: {
    classId: string;
    taskId: string;
    studentBotId: string;
  };
}) {
  const { classId, taskId: testBotId, studentBotId } = params;
  const userImage = await getUserImageByStudentBotId(studentBotId);
  const { messages, id } =
    await getDefaultChatMessagesByStudentBotId(studentBotId);
  let testResults: TestResultsByBotId = null;
  let allStudentResponses: AllStudentResponsesByBotConfigId = null;

  const student = await getSingleStudentByStudentBotId(studentBotId);

  if (student?.isSubmitted) {
    testResults = await getTestResultsByBotId(studentBotId);
  }
  if (student?.isSubmitted) {
    testResults = await getTestResultsByBotId(studentBotId);
    allStudentResponses = await getAllQuestionResponsesByBotConfigId(testBotId);
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl text-center font-semibold ">
        {student?.student.User.name}
      </h1>
      <Separator />
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
            {!messages.length || !student?.isSubmitted ? (
              <div className="text-center text-lg ">
                The student has not attempted the test yet!
              </div>
            ) : (
              <>
                {testResults ? (
                  <div className="flex flex-col items-center space-y-5">
                    <PieChartComponent testResults={testResults} />
                    <Separator />
                    <QuestionList botId={studentBotId} />

                    {/* <ReportTable testResults={testResults} /> */}
                    {/* <ReportHistogram
                      testResults={testResults}
                      allStudentResponses={allStudentResponses}
                    /> */}
                  </div>
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
