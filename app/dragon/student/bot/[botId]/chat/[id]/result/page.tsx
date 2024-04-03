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
import { trackEvent } from "@/lib/mixpanel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { db } from "@/lib/routers";

export type ResultPageProps = {
  params: {
    id: string;
    botId: string;
  };
};

export default async function ResultPage({
  params,
}: Readonly<ResultPageProps>) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  const { id: chatId, botId: taskId } = params;
  const bot = await db.student.bot.getBotByBotId(taskId);
  const type = bot?.BotConfig?.type as TaskType;

  trackEvent("student", "result_viewed", {
    distinct_id: email as string,
    attempt_id: chatId,
    task_type: type,
    task_id: taskId,
  });

  let testResults: TestResultsByBotId = null;

  const botChat = await getBotChatWithStudentByBotChatId({
    botChatId: chatId,
  });

  if (botChat?.isSubmitted) {
    testResults = await getTestResultsByBotChatId({ botChatId: chatId });
  }

  const isQuiz = type === "ai-test";

  return (
    <div className="flex h-screen flex-col space-y-5 pt-6">
      <h1 className="text-center text-2xl font-semibold">
        {isQuiz ? "Quiz Result" : "Test Result"}
      </h1>
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
