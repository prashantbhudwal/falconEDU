"use server";
import { revalidatePath } from "next/cache";

import prisma from "@/prisma";
import { type TestResults } from "@/app/dragon/ai/test-checker/model";
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
  testResults: TestResults
) {
  try {
    const transaction = await prisma.$transaction(async (prisma) => {
      const existingBotChat = await prisma.botChat.findFirst({
        where: { botId: studentBotId },
      });

      if (!existingBotChat) {
        console.log("Bot not found");
        return null;
      }
      const response = await prisma.botChatQuestions.createMany({
        data: testResults.map((ques) => ({
          botChatId: existingBotChat?.id,
          isCorrect: ques.isCorrect,
          student_answer: ques.student_answer,
        })),
      });
      console.log(response);
    });
    console.log("results saved successfully", transaction);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to save results");
  }
};
