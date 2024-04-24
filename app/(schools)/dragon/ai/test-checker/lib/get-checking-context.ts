"use server ";

import { cache } from "react";
import { db } from "@/lib/routers";
const getTest = cache(async function ({ botChatId }: { botChatId: string }) {
  const config = await db.student.botConfig.getConfigByBotChatId({ botChatId });

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
  const { messages } = await db.botChat.getChatMessagesByBotChatId({
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
