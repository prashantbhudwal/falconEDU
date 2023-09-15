import prisma from "@/prisma";
import { cache } from "react";
import * as z from "zod";
import {
  basicBotInfoSchema,
  personalInfoSchema,
  StudentPreferencesSchema,
} from "../teacher/schema";

export const getStudentId = cache(async function (userId: string) {
  console.log("getStudentId function starts");

  const studentProfile = await prisma.studentProfile.findFirst({
    where: { userId },
    select: { id: true },
  });

  console.log("getStudentId function ends", studentProfile?.id);
  return studentProfile?.id;
});

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

export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export type BotsByUserId = UnwrapPromise<ReturnType<typeof getBotsByUserId>>;
export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export const getChatsByBotId = cache(async function (botId: string) {
  const chats = await prisma.botChat.findMany({
    where: { botId },
    select: {
      bot: true,
      id: true,
      messages: true,
      createdAt: true,
      isDefault: true,
    },
  });
  return chats;
});
export type ChatsByBotId = UnwrapPromise<ReturnType<typeof getChatsByBotId>>;

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
  console.log("botChat", botChat);

  const botConfig = botChat?.bot?.BotConfig;

  if (!botConfig) {
    console.error("BotConfig not found for chatId:", chatId);
  }

  return botConfig;
});
export type BotConfigByChatId = UnwrapPromise<
  ReturnType<typeof getBotConfigByChatId>
>;


