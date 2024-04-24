"use server";
import prisma from "@/prisma";
import { BotConfig } from "@prisma/client";

export const createBot = async (config: BotConfig, userId: string) => {
  const botConfigId = config.id;

  const student = await prisma.studentProfile.findUnique({
    where: {
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!student) {
    throw new Error("Student not found");
  }
  const studentId = student.id;

  const existingBot = await prisma.bot.findFirst({
    where: {
      AND: [{ botConfigId }, { studentId }],
    },
    include: {
      BotChat: true,
    },
  });
  if (existingBot) {
    const defaultChat = existingBot.BotChat.find((chat) => chat.isDefault);
    if (!defaultChat) {
      throw new Error("Default chat not found");
    }
    return {
      newBot: existingBot,
      defaultChat: defaultChat,
    };
  }
  if (!existingBot) {
    const newBot = await prisma.bot.create({
      data: {
        botConfigId,
        studentId,
        name: config.name,
        BotChat: {
          create: {
            isDefault: true,
            messages: [],
          },
        },
      },
      include: {
        BotChat: true,
      },
    });
    if (!newBot) throw new Error("Failed to create bot");
    const defaultChat = newBot.BotChat.find((chat) => chat.isDefault);
    if (!defaultChat) {
      throw new Error("Default chat not found");
    }

    return { newBot, defaultChat };
  } else {
    throw new Error("Bot already exists");
  }
};
