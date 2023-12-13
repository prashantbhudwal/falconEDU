import {
  getAllQuestionResponsesByBotConfigId,
  getStudentsByBotConfigId,
} from "../../queries";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { getStudentsURL } from "@/lib/urls";
import { Button } from "@/components/ui/button";
import { SummaryStats } from "./summary-stats";
import { IndividualResponsesList } from "../../../../_components/individual-responses-list";
import { SummaryStatTable } from "./summary-stat-table";
import { db } from "@/app/dragon/teacher/routers";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getTestMetadata } from "../../../../../../../utils";
import { getTestResults } from "@/app/dragon/teacher/routers/parsedQuestionRouter";
import { NoStudents } from "../../../../_components/no-students";
import { NotPublished } from "../../../../_components/not-published";

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
    (student) => student.isSubmitted
  ).length;
  const totalPendingTest = students.length - totalSubmittedTest;
  // const resultObject = await getTestResults({ botConfigId: testBotId });
  // if (!resultObject) return null;

  // const {
  //   allQuestions,
  //   botChatScores,
  //   botChatWiseResults,
  //   studentWiseResults,
  // } = resultObject;

  return (
    <div className="w-full max-w-5xl min-h-screen flex flex-col gap-2 ">
      {!isPublished ? (
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

          <Accordion
            type="single"
            collapsible
            className="w-5/6 bg-base-200 rounded-lg p-2"
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
