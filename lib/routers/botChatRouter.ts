"use server";
import { revalidatePath } from "next/cache";
import prisma from "@/prisma";
import { cache } from "react";
export const createBotChat = async ({ botId }: { botId: string }) => {
  try {
    await prisma.$transaction(async (prisma) => {
      const botChatsCount = await prisma.botChat.count({
        where: { botId },
      });

      const newAttemptNumber = botChatsCount + 1;

      return await prisma.botChat.create({
        data: {
          botId,
          messages: [],
          attemptNumber: newAttemptNumber,
        },
      });
    });
    revalidatePath("/dragon/student");
    return true;
  } catch (error) {
    console.error("Error creating BotChat:", error);
    throw error;
  }
};

export const getFeedbackForBotChat = cache(
  async ({ botChatId }: { botChatId: string }) => {
    try {
      const botChat = await prisma.botChat.findUnique({
        where: { id: botChatId },
      });
      const feedback = botChat?.feedbackToStudent;
      return feedback;
    } catch (error) {
      console.error("Error getting feedback for BotChat:", error);
      throw error;
    }
  },
);
