import { UnwrapPromise } from "@/lib/routers/helpers";
import { getGoalAssessmentResult } from "@/app/dragon/teacher/class/[classId]/(tasks)/[taskId]/ai-test/responses/individual-response/[attemptId]/report";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/routers";
import { GoalAssessmentResult } from "@prisma/client";
import { memoize } from "lodash";
import { Suspense } from "react";
import { getColorForResult } from "@/app/dragon/teacher/class/[classId]/(tasks)/[taskId]/ai-test/responses/individual-response/[attemptId]/report";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

const calculateAverageGrade = memoize(
  (grades: GoalAssessmentResult[]): GoalAssessmentResult => {
    const gradeValues: Record<GoalAssessmentResult, number> = {
      a: 4,
      b: 3,
      c: 2,
      d: 1,
      f: 0,
    } as const;

    const GoalAssessmentResultsArray = ["f", "d", "c", "b", "a"] as const;

    // Check if grades array is not empty
    if (grades.length > 0) {
      // Calculate the sum of the grade values
      const gradeSum = grades.reduce(
        (acc, grade) => acc + gradeValues[grade],
        0,
      );

      // Calculate the average grade value
      const averageGradeValue = gradeSum / grades.length;

      // Round the average grade value to the nearest whole number
      const roundedAverageGradeValue = Math.round(averageGradeValue);

      // Convert the average grade value back into a grade
      const averageGrade = GoalAssessmentResultsArray[roundedAverageGradeValue];

      return averageGrade;
    } else {
      // If the grades array is empty, default to 'f'
      return "f";
    }
  },
);

export async function QuizResult({
  attemptId,
}: Readonly<{
  attemptId: string;
}>) {
  let testResults: UnwrapPromise<ReturnType<typeof getGoalAssessmentResult>> =
    null;
  let feedback: string = "";
  let overallGrade: GoalAssessmentResult = "f";
  const botChat = await db.botChat.getBotChatWithStudentByBotChatId({
    botChatId: attemptId,
  });

  if (botChat?.isSubmitted) {
    testResults = await getGoalAssessmentResult({ botChatId: attemptId });
    let grades: GoalAssessmentResult[] = [];
    if (testResults) grades = testResults.map((result) => result.result);
    overallGrade = calculateAverageGrade(grades);
    feedback =
      (await db.attempt.feedback({
        attemptId,
      })) ?? "";
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col space-y-5 p-4">
        <Card className="flex flex-col items-center space-y-3 py-4">
          <div
            className={cn(
              "text-4xl font-bold uppercase",
              getColorForResult(overallGrade),
            )}
          >
            {overallGrade}
          </div>
          <div> Overall Grade</div>
        </Card>
        <Separator />
        <div className="flex flex-col space-y-3">
          <div className="text-2xl font-semibold">Feedback</div>
          <div className="prose whitespace-pre-wrap">{feedback}</div>
        </div>
      </div>
    </Suspense>
  );
}
