"use server";
import { revalidatePath } from "next/cache";

import prisma from "@/prisma";
import {
  TestResultsAnswerSchema,
  type TestResults,
} from "@/app/dragon/ai/test-checker/tool";
import { z } from "zod";

const testResultObjectSchemaWithId = z.array(
  TestResultsAnswerSchema.extend({
    id: z.string(),
  }),
);
type FinalTestResults = z.infer<typeof testResultObjectSchemaWithId>;

export const submitBotChat = async function ({
  botChatId,
}: {
  botChatId: string;
}) {
  try {
    await prisma.botChat.update({ 
      where: { id: botChatId },
      data: {
        isSubmitted: true,
      },
    });
    revalidatePath("/dragon/student");
    return { success: true };
  } catch (error) {
    console.log("Error updating Bot:", error);
    throw new Error("Failed to update Bot");
  }
};

export const saveTestResultsByBotChatId = async function ({
  testResults,
  botChatId,
}: {
  testResults: FinalTestResults;
  botChatId: string;
}) {
  try {
    const transaction = await prisma.$transaction(async (prisma) => {
      const existingBotChat = await prisma.botChat.findUnique({
        where: {
          id: botChatId,
        },
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
    console.log(err);
    throw new Error("Failed to save results");
  }
};

export const setIsReadToTrue = async function (botChatId: string) {
  const botChat = await prisma.botChat.findFirst({
    where: {
      id: botChatId,
    },
  });

  if (botChat?.isRead) {
    return;
  }

  try {
    await prisma.botChat.update({
      where: {
        id: botChatId,
      },
      data: {
        isRead: true,
      },
    });
    revalidatePath("/");
  } catch (error) {
    console.error("Error updating Chat Status.", error);
    throw new Error("Failed to update Chat Status");
  }
};
