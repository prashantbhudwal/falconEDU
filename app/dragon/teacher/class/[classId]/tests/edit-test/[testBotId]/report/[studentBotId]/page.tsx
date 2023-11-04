type ReportProps = {
  params: {
    classId: string;
    testBotId: string;
    studentBotId: string;
  };
};

import { ChatList } from "@/components/chat/chat-list";
import {
  getDefaultChatMessagesByStudentBotId,
  getUserImageByStudentBotId,
} from "../../../../queries";
import { Paper } from "@/components/ui/paper";
import testResult from "./testResults";
import PieChartComponent from "./pieChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/progress";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type ReportType = {
  report: {
    question_number: number;
    student_answer: string;
    correct_answer: string;
    isCorrect: boolean;
  }[];
};

export default async function Report({ params }: ReportProps) {
  const { classId, testBotId, studentBotId } = params;
  const userImage = await getUserImageByStudentBotId(studentBotId);
  const { messages, id } =
    await getDefaultChatMessagesByStudentBotId(studentBotId);

  const { report }: ReportType = messages.length
    ? await testResult(id, messages)
    : null;

  console.log(report);

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
                    <Table>
                      <TableCaption>Stat for your Answers.</TableCaption>
                      <TableHeader>
                        <TableRow className="hover:bg-muted/0">
                          <TableHead className="w-[100px]">Q.No.</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right flex gap-1 items-center justify-end">
                            <TooltipProvider>
                              <Tooltip delayDuration={200}>
                                <TooltipTrigger>
                                  <InformationCircleIcon className="w-4 h-4" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-base-300 max-w-[200px]">
                                  <p className="text-[10px] text-white text-center">
                                    What percentage of students who attempted
                                    the test have gotten this right?
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            Performance
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {report.map((question, i: number) => {
                          const randomNumber =
                            Math.floor(Math.random() * (100 - 20 + 1)) + 20; // random number for progress bar later replace it with actual data
                          let progressBarColor = "bg-orange-400";
                          if (randomNumber < 40) {
                            progressBarColor = "bg-red-500";
                          }
                          if (randomNumber < 70 && randomNumber >= 40) {
                            progressBarColor = "bg-orange-400";
                          }
                          if (randomNumber <= 100 && randomNumber >= 70) {
                            progressBarColor = "bg-green-400";
                          }
                          return (
                            <TableRow key={i} className="hover:bg-muted/0">
                              <TableCell className="font-medium">
                                {question.question_number}
                              </TableCell>
                              <TableCell>
                                {question.isCorrect ? (
                                  <span className="text-green-500">
                                    Correct
                                  </span>
                                ) : (
                                  <span className="text-red-500">
                                    Incorrect
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-5 items-center">
                                  {randomNumber}%
                                  <Progress
                                    value={randomNumber}
                                    indicatorColor={progressBarColor}
                                  />
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
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
