import { UnwrapPromise } from "@/lib/routers/helpers";
import prisma from "@/prisma";
import { cache } from "react";
import { getBotChatWithStudentByBotChatId } from "../../../../test/queries";
import { Card, CardContent } from "@/components/ui/card";

export const getGoalAssessmentResult = cache(
  async ({ botChatId }: { botChatId: string }) => {
    try {
      const goals = await prisma.goalAssessment.findMany({
        where: { botChatId },
        include: { learningGoal: true },
      });

      if (!goals || goals.length === 0) return null;

      const parsedGoals = goals.map((goal) => {
        const { learningGoal, ...rest } = goal;
        return {
          ...learningGoal,
          ...rest,
        };
      });

      parsedGoals.sort((a, b) => {
        if (a.goalNumber && b.goalNumber) {
          return a.goalNumber - b.goalNumber;
        }
        return 0;
      });

      return parsedGoals;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
);

export async function AITestReport({
  taskId,
  attemptId,
}: Readonly<{
  taskId: string;
  attemptId: string;
}>) {
  let testResults: UnwrapPromise<ReturnType<typeof getGoalAssessmentResult>> =
    null;
  const botChat = await getBotChatWithStudentByBotChatId({
    botChatId: attemptId,
  });

  if (botChat?.isSubmitted) {
    testResults = await getGoalAssessmentResult({ botChatId: attemptId });
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
            <div className="flex flex-col items-center space-y-4">
              {testResults.map((goal) => (
                <Card
                  key={goal.id}
                  className="w-full space-y-3 rounded  p-4 shadow-md"
                >
                  <CardContent className="space-y-3">
                    <div className="font-bold">
                      {goal.goalNumber}. {goal.goal}
                    </div>
                    <div
                      className={` font-semibold ${getColorForResult(goal.result)}`}
                    >
                      Grade: <span className="capitalize">{goal.result}</span>
                    </div>

                    <div className="text-md text-gray-600">
                      {goal.aiRemarks && goal.aiRemarks.length > 0
                        ? goal.aiRemarks
                        : "-"}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-lg ">
              Can&apos;t generate report. Try again later...
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function getColorForResult(result: string) {
  switch (result) {
    case "a":
    case "b":
      return "text-green-500";
    case "c":
      return "text-yellow-500";
    case "d":
    case "f":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
}

function removeGradePrefix(text: string) {
  // Find the index of the first colon
  const colonIndex = text.indexOf(":");

  // Check if a colon was found
  if (colonIndex !== -1) {
    // Return the substring after the first colon
    return text.substring(colonIndex + 1).trim();
  }

  // If no colon is found, return the original text
  return text;
}
