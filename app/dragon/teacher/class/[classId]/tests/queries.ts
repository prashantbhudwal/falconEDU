import prisma from "@/prisma";
import { cache } from "react";
export const revalidate = 3600; // 1 h
import { type Message } from "ai/react";

export const getStudentsByBotConfigId = cache(async function (
  botConfigId: string
) {
  const bots = await prisma.bot.findMany({
    where: { botConfigId },
    select: {
      id: true,
      isSubmitted: true,
      isChecked: true,
      isActive: true,
      student: {
        select: {
          User: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  });

  if (bots.length === 0) {
    console.log(`No bots found with botConfigId ${botConfigId}`);
    return null;
  }

  const students = bots.map((bot) => ({
    studentBotId: bot.id,
    name: bot.student.User.name,
    email: bot.student.User.email,
    image: bot.student.User.image,
    isSubmitted: bot.isSubmitted,
    isChecked: bot.isChecked,
    isActive: bot.isActive,
  }));

  return students;
});

export const getDefaultChatMessagesByStudentBotId = cache(async function (
  studentBotId: string
): Promise<{ messages: Message[]; id: string }> {
  const defaultChat = await prisma.botChat.findFirst({
    where: {
      botId: studentBotId,
      isDefault: true,
    },
    // select: {
    //   messages: true,
    // },
  });

  console.log(defaultChat);

  if (!defaultChat || !defaultChat.messages) {
    throw new Error(`Default chat not found for studentBotId ${studentBotId}`);
  }

  if (typeof defaultChat.messages === "string") {
    const parsedMessages = JSON.parse(defaultChat.messages);
    if (!Array.isArray(parsedMessages)) {
      throw new Error("Parsed messages are not an array");
    }
    console.log(parsedMessages);
    return { messages: parsedMessages, id: defaultChat?.id };
  } else {
    return { messages: [], id: defaultChat?.id };
  }
});

export const getUserImageByStudentBotId = async function (
  studentBotId: string
): Promise<string | null> {
  const bot = await prisma.bot.findUnique({
    where: { id: studentBotId },
    select: {
      student: {
        select: {
          User: {
            select: {
              image: true,
            },
          },
        },
      },
    },
  });

  if (!bot || !bot.student || !bot.student.User) {
    throw new Error(`User not found for studentBotId ${studentBotId}`);
  }

  return bot.student.User.image;
};
