import { Separator } from "@/components/ui/separator";
import PieChartComponent from "./pieChart";
import { QuestionList } from "./question-list";
import {
  AllStudentResponsesByBotConfigId,
  getAllQuestionResponsesByBotConfigId,
  getSingleStudentByStudentBotId,
} from "../../queries";
import {
  TestResultsByBotId,
  getTestResultsByBotId,
} from "@/app/dragon/teacher/queries";

export async function StudentReport({
  studentBotId,
  taskId,
}: {
  studentBotId: string;
  taskId: string;
}) {
  let testResults: TestResultsByBotId = null;
  let allStudentResponses: AllStudentResponsesByBotConfigId = null;
  const student = await getSingleStudentByStudentBotId(studentBotId);
  if (student?.isSubmitted) {
    testResults = await getTestResultsByBotId(studentBotId);
    allStudentResponses = await getAllQuestionResponsesByBotConfigId(taskId);
  }

  return (
    <div>
      {!student?.isSubmitted ? (
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
    </div>
  );
}
