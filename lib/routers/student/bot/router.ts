"use server";
import prisma from "@/prisma";
import { cache } from "react";
import { getStudentId } from "../router";
export const getBotsByUserId = cache(async function (userId: string) {
  const studentId = await getStudentId(userId);
  if (!studentId) {
    console.error(`StudentProfile with userId ${userId} not found`);
  }
  const bots = await prisma.bot.findMany({
    where: { studentId },
    select: {
      id: true,
      name: true,
      BotConfig: {
        select: {
          name: true,
          teacher: {
            select: {
              User: {
                select: {
                  image: true,
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

export const getBotByBotId = cache(async function (botId: string) {
  const bot = await prisma.bot.findUnique({
    where: { id: botId },
    select: {
      id: true,
      name: true,
      isActive: true,
      isSubmitted: true,
      BotChat: true,
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
  });
  return bot;
});
