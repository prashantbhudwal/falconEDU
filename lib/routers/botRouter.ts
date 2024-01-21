"use server";
import { isAuthorized } from "@/lib/is-authorized";
import prisma from "@/prisma";
import { revalidatePath } from "next/cache";
import { cache } from "react";
import { UnwrapPromise } from "../../app/dragon/student/queries";

export const archiveAllBotsOfBotConfig = async (botConfigId: string) => {
  await isAuthorized({
    userType: "TEACHER",
  });
  try {
    const updateBots = prisma.bot.updateMany({
      where: {
        botConfigId: botConfigId,
      },
      data: {
        isActive: false,
      },
    });

    const updateBotConfig = prisma.botConfig.update({
      where: {
        id: botConfigId,
      },
      data: {
        isActive: false,
      },
    });

    const transactionResult = await prisma.$transaction([
      updateBots,
      updateBotConfig,
    ]);

    revalidatePath("/dragon/teacher/");
    return { success: true, error: null };
  } catch (error) {
    console.error("Error removing student from class:", error);
    return { error: true, success: false };
  }
};

export const unArchiveAllBotsOfBotConfig = async (botConfigId: string) => {
  await isAuthorized({
    userType: "TEACHER",
  });
  try {
    const updateBots = prisma.bot.updateMany({
      where: {
        botConfigId: botConfigId,
      },
      data: {
        isActive: true,
      },
    });

    const updateBotConfig = prisma.botConfig.update({
      where: {
        id: botConfigId,
      },
      data: {
        isActive: true,
      },
    });

    const transactionResult = await prisma.$transaction([
      updateBots,
      updateBotConfig,
    ]);

    revalidatePath("/dragon/teacher/");
    return { success: true, error: null };
  } catch (error) {
    console.error("Error removing student from class:", error);
    return { error: true, success: false };
  }
};

export const deleteBotConfigAndDeactivateBots = async (botConfigId: string) => {
  await isAuthorized({
    userType: "TEACHER",
  });
  try {
    const deactivateBots = prisma.bot.updateMany({
      where: {
        botConfigId: botConfigId,
      },
      data: {
        isActive: false,
      },
    });

    const deleteBotConfig = prisma.botConfig.delete({
      where: {
        id: botConfigId,
      },
    });

    const transactionResult = await prisma.$transaction([
      deactivateBots,
      deleteBotConfig,
    ]);

    revalidatePath("/dragon/teacher/");
    return { success: true };
  } catch (error) {
    console.error("Error removing student from class:", error);
    return { error: true };
  }
};

export const getBotsByTeacherAndStudentID = cache(async function (
  teacherId: string,
  userId: string,
) {
  // Fetch studentId from StudentProfile using userId
  const studentProfile = await prisma.studentProfile.findFirst({
    where: {
      userId: userId,
    },
    select: {
      id: true,
    },
  });

  // If no matching student profile, return an empty array or handle as needed
  if (!studentProfile) return [];

  const studentId = studentProfile.id;

  // Fetch bots filtered by teacherId and studentId
  const bots = await prisma.bot.findMany({
    where: {
      BotConfig: {
        teacherId: teacherId,
        published: true,
      },
      studentId: studentId,
    },
    select: {
      id: true,
      isSubmitted: true,
      createdAt: true,
      isActive: true,
      BotConfig: {
        select: {
          name: true,
          type: true,
          isActive: true,
          canReAttempt: true,
          maxAttempts: true,
          teacher: {
            select: {
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
  });
  return bots;
});

export type BotsByTeacherAndStudentID = UnwrapPromise<
  ReturnType<typeof getBotsByTeacherAndStudentID>
>;
