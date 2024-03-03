"use server";
import { revalidatePath } from "next/cache";
import prisma from "@/prisma";
import { cache } from "react";
export const create = async ({ botId }: { botId: string }) => {
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

export const feedback = cache(async ({ attemptId }: { attemptId: string }) => {
  try {
    const botChat = await prisma.botChat.findUnique({
      where: { id: attemptId },
    });
    const feedback = botChat?.feedbackToStudent;
    return feedback;
  } catch (error) {
    console.error("Error getting feedback for BotChat:", error);
    throw error;
  }
});

export const preferences = cache(async function ({
  attemptId,
}: {
  attemptId: string;
}) {
  const context = await prisma.botChat.findUnique({
    where: { id: attemptId },
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

  if (!context) throw new Error(`Context not found for chatId ${attemptId}`);
  const Class = context?.bot?.BotConfig?.Class;
  if (!Class) throw new Error(`Class not found for chatId ${attemptId}`);
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

export const submit = async function ({ attemptId }: { attemptId: string }) {
  try {
    await prisma.botChat.update({
      where: { id: attemptId },
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
