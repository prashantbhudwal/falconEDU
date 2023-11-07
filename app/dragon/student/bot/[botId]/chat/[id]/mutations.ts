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
        return null;
      }
      const response = await prisma.botChatQuestions.createMany({
        data: testResults.map((ques) => ({
          botChatId: existingBotChat?.id,
          question: ques.question,
          question_number: ques.question_number,
          question_type: "OBJECTIVE_FILL_IN_THE_BLANK_SINGLE_ANSWER",
          correct_answer: ques.correct_answer,
          isCorrect: ques.isCorrect,
          student_answer: ques.student_answer,
        })),
      });
    });
    console.log("results saved successfully", transaction);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to save results");
  }
};
