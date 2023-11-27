import {
  getAllQuestionResponsesByBotConfigId,
  getStudentsByBotConfigId,
} from "../../queries";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { getStudentsURL } from "@/lib/urls";
import { Button } from "@/components/ui/button";
import { SummaryStats } from "./summary-stats";
import { SubmissionsList } from "./submissions-list";
import { SummaryStatTable } from "./summary-stat-table";
import { db } from "@/app/dragon/teacher/routers";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getTestMetadata } from "../../../utils";
import { getTestResults } from "@/app/dragon/teacher/routers/parsedQuestionRouter";

export async function TestAnalysis({
  testBotId,
  classId,
}: {
  testBotId: string;
  classId: string;
}) {
  const allStudentResponses =
    await getAllQuestionResponsesByBotConfigId(testBotId);
  const { averageScore, highestScore, leastScore, maxScore } =
    getTestMetadata(allStudentResponses);
  const testQuestions =
    await db.parseQuestionRouter.getParsedQuestionByBotConfigId({
      botConfigId: testBotId,
    });
  const results = await db.parseQuestionRouter.getTestResults({
    botConfigId: testBotId,
  });

  const { isPublished, students } = await getStudentsByBotConfigId(testBotId);
  const totalSubmittedTest = students.filter(
    (student) => student.isSubmitted
  ).length;
  const totalPendingTest = students.length - totalSubmittedTest;
  const resultObject = await getTestResults({ botConfigId: testBotId });
  if (!resultObject) return null;

  const {
    allQuestions,
    botChatScores,
    botChatWiseResults,
    studentWiseResults,
  } = resultObject;

  return (
    <div className="w-full max-w-5xl min-h-screen flex flex-col gap-2 ">
      {!isPublished && students.length === 0 ? (
        <NotPublished />
      ) : students.length !== 0 ? (
        <div className="flex flex-col gap-4 items-center">
          <SummaryStats
            averageScore={averageScore}
            highestScore={highestScore}
            leastScore={leastScore}
            totalSubmittedTest={totalSubmittedTest}
            totalPendingTest={totalPendingTest}
          />

          {/* <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                <SummaryStatTable testQuestions={testQuestions} />
              </AccordionContent>
            </AccordionItem>
          </Accordion> */}
          {/* Individual responses */}

          <SummaryStatTable testQuestions={testQuestions} />

          <Separator />
          <h1 className="text-center font-semibold text-xl mt-10 ">
            Individual Responses
          </h1>
          <SubmissionsList
            students={students}
            classId={classId}
            testBotId={testBotId}
          />
        </div>
      ) : (
        <AddStudents classId={classId} />
      )}
    </div>
  );
}

const AddStudents = function ({ classId }: { classId: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <h1 className="text-center font-semibold text-xl mt-10 ">
        You have no students in this class.
      </h1>
      <Link href={getStudentsURL(classId)}>
        <Button variant={"outline"}>Add Students</Button>
      </Link>
    </div>
  );
};

const NotPublished = function () {
  return (
    <div className="flex flex-col items-center gap-3">
      <h1 className="text-center font-semibold text-xl mt-10 ">
        This test is not published yet.
      </h1>
    </div>
  );
};
