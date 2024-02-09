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

export const getPreferences = cache(async function ({
  chatId,
}: {
  chatId: string;
}) {
  const context = await prisma.botChat.findUnique({
    where: { id: chatId },
    select: {
      bot: {
        select: {
          student: {
            select: {
              preferences: true,
              User: {
                select: {
                  name: true,
                },
              },
            },
          },
          BotConfig: {
            select: {
              preferences: true,
              Class: true,
              teacher: {
                select: {
                  preferences: true,
                  User: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!context) throw new Error(`Context not found for chatId ${chatId}`);
  const Class = context?.bot?.BotConfig?.Class;
  if (!Class) throw new Error(`Class not found for chatId ${chatId}`);
  const grade = Class.grade;

  let configPreferences = context?.bot?.BotConfig?.preferences;
  let teacherPreferences = context?.bot?.BotConfig?.teacher?.preferences;
  let studentPreferences = context?.bot?.student?.preferences;

  return {
    configPreferences,
    teacherPreferences,
    studentPreferences,
  };
});
