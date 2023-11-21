"use server ";

import { cache } from "react";
import prisma from "@/prisma";
import { getBotByBotId } from "@/app/dragon/student/queries";
import { getDefaultChatMessagesByStudentBotId } from "@/app/dragon/teacher/class/[classId]/tests/queries";

const getTest = cache(async function (testBotId: string) {
  const bot = await getBotByBotId(testBotId);

  if (bot) {
    //TODO: same logic is repated in teacher/queries
    const questions = await prisma.botConfig.findUnique({
      where: { id: bot?.BotConfig.id },
      select: {
        parsedQuestions: true,
      },
    });

    if (questions && questions.parsedQuestions.length > 0) {
      return { testQuestions: questions?.parsedQuestions };
    }

    return { testQuestions: null };
  }

  return { testQuestions: null };
});

export const getCheckingContext = async function (testBotId: string) {
  const { messages, id: botChatId } =
    await getDefaultChatMessagesByStudentBotId(testBotId);

  const { testQuestions } = (await getTest(testBotId)) ?? {
    testQuestions: null,
  };

  if (!testQuestions) {
    throw new Error("Test not found");
  }
  return { testQuestions, messages };
};
