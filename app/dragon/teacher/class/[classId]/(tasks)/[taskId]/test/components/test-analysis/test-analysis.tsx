import {
  getAllQuestionResponsesByBotConfigId,
  getStudentsByBotConfigId,
} from "../../queries";
import { Separator } from "@/components/ui/separator";
import { SummaryStats } from "./summary-stats";
import { IndividualResponsesList } from "../../../../components/individual-responses-list";
import { SummaryStatTable } from "./summary-stat-table";
import { db } from "@/lib/routers";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getTestMetadata } from "../../../../../../../utils";
import { NoStudents } from "../../../../components/no-students";
import { NotPublished } from "../../../../components/not-published";

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
  const { activeParsedQuestions, archivedParsedQuestions } =
    await db.parseQuestionRouter.getParsedQuestionByBotConfigId({
      botConfigId: testBotId,
    });
  const results = await db.parseQuestionRouter.getTestResults({
    botConfigId: testBotId,
  });

  const { isPublished, students } = await getStudentsByBotConfigId(testBotId);
  const totalSubmittedTest = students.filter(
    (student) => student.isSubmitted,
  ).length;
  const totalPendingTest = students.length - totalSubmittedTest;

  return (
    <div className="flex min-h-screen w-full max-w-5xl flex-col gap-2 ">
      {!isPublished ? (
        <NotPublished />
      ) : students.length !== 0 ? (
        <div className="flex flex-col items-center gap-4">
          <SummaryStats
            averageScore={averageScore}
            highestScore={highestScore}
            leastScore={leastScore}
            totalSubmittedTest={totalSubmittedTest}
            totalPendingTest={totalPendingTest}
          />

          <Accordion
            type="single"
            collapsible
            className="w-5/6 rounded-lg bg-base-200 p-2"
          >
            <AccordionItem value="item-1" className="border-none">
              <AccordionTrigger className="text-lg hover:no-underline">
                Question-wise performance
              </AccordionTrigger>
              <AccordionContent className="border-none">
                <SummaryStatTable
                  testQuestions={
                    Array.isArray(archivedParsedQuestions) &&
                    Array.isArray(activeParsedQuestions)
                      ? [...archivedParsedQuestions, ...activeParsedQuestions]
                      : null
                  }
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Separator />
          <IndividualResponsesList
            classId={classId}
            taskId={testBotId}
            type={"test"}
          />
        </div>
      ) : (
        <NoStudents classId={classId} />
      )}
    </div>
  );
}
