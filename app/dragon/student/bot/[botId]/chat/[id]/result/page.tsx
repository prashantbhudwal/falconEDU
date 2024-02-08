import { getBotByBotId } from "@/app/dragon/student/queries";
import { TaskType } from "@/types";
import React from "react";
import { AITestReport } from "@/app/dragon/teacher/class/[classId]/(tasks)/[taskId]/ai-test/responses/individual-response/[attemptId]/report";
import {
  TestResultsByBotId,
  getTestResultsByBotChatId,
} from "@/app/dragon/teacher/queries";
import { getBotChatWithStudentByBotChatId } from "@/app/dragon/teacher/class/[classId]/(tasks)/[taskId]/test/queries";
import PieChartComponent from "@/app/dragon/teacher/class/[classId]/(tasks)/[taskId]/test/components/report/pieChart";
import { Separator } from "@/components/ui/separator";
import { QuestionList } from "@/app/dragon/teacher/class/[classId]/(tasks)/[taskId]/test/components/report/question-list";
import BackBar from "@/components/back-bar";
import { url } from "@/lib/urls";
import { QuizResult } from "./quiz-result";

export type ResultPageProps = {
  params: {
    id: string;
    botId: string;
  };
};

export default async function ResultPage({
  params,
}: Readonly<ResultPageProps>) {
  const { id: chatId, botId: taskId } = params;
  const bot = await getBotByBotId(taskId);
  const type = bot?.BotConfig?.type as TaskType;

  let testResults: TestResultsByBotId = null;

  const botChat = await getBotChatWithStudentByBotChatId({
    botChatId: chatId,
  });

  if (botChat?.isSubmitted) {
    testResults = await getTestResultsByBotChatId({ botChatId: chatId });
  }

  const isQuiz = type === "ai-test";

  return (
    <div className="flex h-screen flex-col">
      <BackBar link={url.student.botChat({ botId: taskId, chatId })} />
      <div className="custom-scrollbar overflow-y-auto">
        {isQuiz ? (
          <QuizResult attemptId={chatId} />
        ) : (
          <div className="flex flex-col items-center space-y-5">
            <PieChartComponent testResults={testResults} />
            <Separator />
            <QuestionList attemptId={chatId} />
          </div>
        )}
      </div>
    </div>
  );
}
