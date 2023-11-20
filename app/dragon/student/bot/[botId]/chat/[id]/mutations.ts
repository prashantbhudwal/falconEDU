"use server";
import { revalidatePath } from "next/cache";

import prisma from "@/prisma";
import {
  TestResultsAnswerSchema,
  type TestResults,
} from "@/app/dragon/ai/test-checker/model";
import { z } from "zod";

const testResultObjectSchemaWithId = z.array(
  TestResultsAnswerSchema.extend({
    id: z.string(),
  })
);
type FinalTestResults = z.infer<typeof testResultObjectSchemaWithId>;

export const submitTestBot = async function (botId: string) {
  try {
    await prisma.bot.update({
      where: { id: botId },
      data: {
        isSubmitted: true,
      },
    });
    revalidatePath("/dragon/student/");
  } catch (error) {
    console.error("Error updating Bot:", error);
    throw new Error("Failed to update Bot");
  }
};

export const saveTestResultsByBotId = async function (
  studentBotId: string,
  testResults: FinalTestResults
) {
  try {
    const transaction = await prisma.$transaction(async (prisma) => {
      const existingBotChat = await prisma.botChat.findFirst({
        where: { botId: studentBotId },
      });
      if (!existingBotChat) {
        console.error("Bot not found");
        return null;
      }
      const response = await prisma.botChatQuestions.createMany({
        data: testResults.map((ques) => ({
          botChatId: existingBotChat?.id,
          isCorrect: ques.isCorrect,
          student_answer: ques.student_answer,
          parsedQuestionsId: ques.id,
        })),
      });
    });
  } catch (err) {
    console.error(err);
    throw new Error("Failed to save results");
  }
};
