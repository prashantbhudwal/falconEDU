"use server";
import prisma from "@/prisma";
import { cache } from "react";
export const getClassByBotId = async function ({ botId }: { botId: string }) {
  try {
    const response = await prisma.bot.findUnique({
      where: { id: botId },
      select: {
        BotConfig: {
          select: {
            Class: true,
          },
        },
      },
    });
    if (response?.BotConfig.Class) {
      return response.BotConfig.Class;
    }
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
};
