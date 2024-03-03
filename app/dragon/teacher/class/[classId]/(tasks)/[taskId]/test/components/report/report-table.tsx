import {
  TestResultsByBotId,
  getTotalQuestionByParsedQuestionId,
} from "@/app/dragon/teacher/queries";
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
import { getProgressBarColor } from "../../../../../../../../../../lib/helpers";

export const ReportTable = ({
  testResults,
}: {
  testResults: TestResultsByBotId;
}) => {
  if (!testResults) return null;

  const getTotalQuestion = async (id: string) => {
    const response = await getTotalQuestionByParsedQuestionId(id);
    return response;
  };

  return (
    <Table>
      <TableCaption>Stat for your Answers.</TableCaption>
      <TableHeader>
        <TableRow className="hover:bg-muted/0">
          <TableHead className="w-[100px]">Q.No.</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="flex items-center justify-end gap-1 text-right">
            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger>
                  <InformationCircleIcon className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[200px] bg-base-300">
                  <p className="text-center text-[10px] text-white">
                    What percentage of students who attempted the test have
                    gotten this right?
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            Performance
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {testResults.map(async (question, i: number) => {
          const attemptedQuestions = await getTotalQuestion(
            question.parsedQuestionsId as string,
          );
          const correctQuestions = attemptedQuestions?.filter(
            (ques) => ques.isCorrect,
          );
          let correctQuestionsPercentage = 20;
          if (correctQuestions && attemptedQuestions) {
            correctQuestionsPercentage =
              (correctQuestions.length / attemptedQuestions.length) * 100;
          }
          const progressBarColor = getProgressBarColor(
            correctQuestionsPercentage,
          );
          return (
            <TableRow key={i} className="hover:bg-muted/0">
              <TableCell className="font-medium">{i + 1}</TableCell>
              <TableCell>
                {question.isCorrect ? (
                  <span className="text-green-500">Correct</span>
                ) : (
                  <span className="text-red-500">Incorrect</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-5">
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
  );
};
