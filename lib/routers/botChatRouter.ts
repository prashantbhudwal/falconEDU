"use server";
import * as z from "zod";
import { revalidatePath } from "next/cache";
import prisma from "@/prisma";
import { cache } from "react";
import { UnwrapPromise } from "../../app/dragon/student/queries";
import { TaskType } from "@/types/dragon";
import { getTaskProperties } from "../../app/dragon/teacher/utils";
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
