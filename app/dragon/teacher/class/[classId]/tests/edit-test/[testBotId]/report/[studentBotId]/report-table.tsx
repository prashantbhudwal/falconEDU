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

export const ReportTable = ({
  testResults,
}: {
  testResults?: TestResultsByBotId;
}) => {
  if (!testResults) return null;
  const getTotalQuestion = async (id: string) => {
    const response = await getTotalQuestionByParsedQuestionId(id);
    return response;
  };

  const getBarColor = (percentageValue: number) => {
    if (percentageValue < 40) {
      return "bg-red-500";
    }
    if (percentageValue < 70 && percentageValue >= 40) {
      return "bg-orange-400";
    }
    if (percentageValue <= 100 && percentageValue >= 70) {
      return "bg-green-400";
    } else {
      return "bg-orange-400";
    }
  };

  return (
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
            question.parsedQuestionsId as string
          );
          const correctQuestions = attemptedQuestions?.filter(
            (ques) => ques.isCorrect
          );
          let correctQuestionsPercentage = 20;
          if (correctQuestions && attemptedQuestions) {
            correctQuestionsPercentage =
              (correctQuestions.length / attemptedQuestions.length) * 100;
          }
          const progressBarColor = getBarColor(correctQuestionsPercentage);
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
  );
};
