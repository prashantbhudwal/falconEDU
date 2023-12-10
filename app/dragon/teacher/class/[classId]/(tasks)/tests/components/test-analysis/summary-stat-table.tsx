import { getTotalQuestionByParsedQuestionId } from "@/app/dragon/teacher/queries";
import { Progress } from "@/components/progress";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { getProgressBarColor } from "../../../../utils";
import { typeGetParsedQuestionByBotConfigId } from "@/app/dragon/teacher/routers/parsedQuestionRouter";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
export const SummaryStatTable = ({
  testQuestions,
}: {
  testQuestions: typeGetParsedQuestionByBotConfigId["activeParsedQuestions"];
}) => {
  if (!testQuestions) return null;

  const getTotalQuestion = async (id: string) => {
    const response = await getTotalQuestionByParsedQuestionId(id);
    return response;
  };

  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center space-y-2">
          <Skeleton className="h-2 w-full rounded-lg" />
          <Skeleton className="h-2 w-full rounded-lg" />
        </div>
      }
    >
      <Table>
        <Header />
        <TableBody>
          {testQuestions.map(async (question: any, i: number) => {
            const attemptedQuestions = await getTotalQuestion(
              question.id as string
            );

            const correctQuestions = attemptedQuestions?.filter(
              (ques) => ques.isCorrect
            );

            let correctQuestionsPercentage = 20;

            if (correctQuestions && attemptedQuestions) {
              correctQuestionsPercentage =
                (correctQuestions.length / attemptedQuestions.length) * 100;
            }

            const progressBarColor = getProgressBarColor(
              correctQuestionsPercentage
            );

            return (
              <TableRow key={i} className="hover:bg-muted/0">
                <TableCell className="font-medium text-left">{i + 1}</TableCell>
                <TableCell>
                  <div className="flex gap-5 items-center">
                    {correctQuestionsPercentage.toFixed(1)}%
                    <Progress
                      value={correctQuestionsPercentage}
                      indicatorColor={progressBarColor}
                    />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Suspense>
  );
};

export const Header = () => (
  <TableHeader>
    <TableRow className="hover:bg-muted/0">
      <TableHead className="w-[100px]">Q.No.</TableHead>
      <TableHead className="text-right flex gap-1 items-center justify-end">
        <TooltipProvider>
          <Tooltip delayDuration={200}>
            <TooltipTrigger>
              <InformationCircleIcon className="w-4 h-4" />
            </TooltipTrigger>
            <TooltipContent className="bg-base-300 max-w-[200px]">
              <p className="text-[10px] text-white text-center">
                What percentage of students who attempted the test have gotten
                this right?
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        Performance
      </TableHead>
    </TableRow>
  </TableHeader>
);
