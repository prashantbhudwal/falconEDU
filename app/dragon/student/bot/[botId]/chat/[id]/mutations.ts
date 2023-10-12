"use server";
import { revalidatePath } from "next/cache";

import prisma from "@/prisma";

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
