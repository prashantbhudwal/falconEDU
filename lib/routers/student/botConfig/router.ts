"use server";
import prisma from "@/prisma";
import { cache } from "react";

export const getConfigByBotChatId = cache(async function ({
  botChatId,
}: {
  botChatId: string;
}) {
  const botChat = await prisma.botChat.findUnique({
    where: { id: botChatId },
    select: {
      bot: {
        select: {
          BotConfig: {
            select: {
              id: true,
              name: true,
              type: true,
              isActive: true,
              published: true,
              teacherId: true,
              timeLimit: true,
              canReAttempt: true,
              parsedQuestions: true,
              teacher: {
                select: {
                  User: {
                    select: {
                      image: true,
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
  const botConfig = botChat?.bot?.BotConfig;

  if (!botConfig) {
    console.error("BotConfig not found for chatId:", botChatId);
  }
  return botConfig;
});

export const getBotConfigByChatId = cache(async function (chatId: string) {
  const botChat = await prisma.botChat.findUnique({
    where: { id: chatId },
    select: {
      bot: {
        select: {
          BotConfig: true,
        },
      },
    },
  });

  const botConfig = botChat?.bot?.BotConfig;

  if (!botConfig) {
    console.error("BotConfig not found for chatId:", chatId);
  }

  return botConfig;
});