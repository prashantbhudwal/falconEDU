"use server";
import { isAuthorized } from "@/lib/is-authorized";
import prisma from "@/prisma";
import { revalidatePath } from "next/cache";
import { getClassesURL, getStudentsURL } from "@/lib/urls";

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
    return { success: true };
  } catch (error) {
    console.error("Error removing student from class:", error);
    return { error: true };
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
    return { success: true };
  } catch (error) {
    console.error("Error removing student from class:", error);
    return { error: true };
  }
};
