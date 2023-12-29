"use server ";

import { cache } from "react";
import { getConfigByBotChatId } from "@/app/dragon/student/queries";
import { getChatMessagesByBotChatId } from "@/app/dragon/teacher/class/[classId]/(tasks)/[taskId]/test/queries";
const getTest = cache(async function ({ botChatId }: { botChatId: string }) {
  const config = await getConfigByBotChatId({ botChatId });

  if (config) {
    const questions = config?.parsedQuestions;

    if (questions && questions.length > 0) {
      return { testQuestions: questions };
    }

    return { testQuestions: null };
  }

  return { testQuestions: null };
});

export const getCheckingContext = async function ({
  botChatId,
}: {
  botChatId: string;
}) {
  const { messages } = await getChatMessagesByBotChatId({
    botChatId,
  });

  const { testQuestions } = (await getTest({ botChatId })) ?? {
    testQuestions: null,
  };

  if (!testQuestions) {
    throw new Error("Test not found");
  }
  return { testQuestions, messages };
};
