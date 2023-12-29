import { Separator } from "@/components/ui/separator";
import PieChartComponent from "./pieChart";
import { QuestionList } from "./question-list";
import { getBotChatWithStudentByBotChatId } from "../../queries";
import {
  TestResultsByBotId,
  getTestResultsByBotChatId,
} from "@/app/dragon/teacher/queries";

export async function StudentReport({
  taskId,
  attemptId,
}: {
  taskId: string;
  attemptId: string;
}) {
  let testResults: TestResultsByBotId = null;
  const botChat = await getBotChatWithStudentByBotChatId({
    botChatId: attemptId,
  });

  if (botChat?.isSubmitted) {
    testResults = await getTestResultsByBotChatId({ botChatId: attemptId });
  }

  return (
    <div>
      {!botChat?.isSubmitted ? (
        <div className="text-center text-lg ">
          The student has not attempted the test yet!
        </div>
      ) : (
        <>
          {testResults ? (
            <div className="flex flex-col items-center space-y-5">
              <PieChartComponent testResults={testResults} />
              <Separator />
              <QuestionList attemptId={attemptId} />
            </div>
          ) : (
            <div className="text-center text-lg ">
              Can&apos;t generate report . Try again later...
            </div>
          )}
        </>
      )}
    </div>
  );
}
