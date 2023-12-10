"use server";

import prisma from "@/prisma";
import { cache } from "react";
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export const getClassIsActiveByClassId = cache(async (classId: string) => {
  try {
    const response = await prisma.class.findUnique({
      where: { id: classId },
      select: {
        isActive: true,
      },
    });
    if (!response) {
      throw new Error("class not found");
    }
    if (response.isActive) {
      return true;
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
});

export const getTotalStudentsByClassId = cache(async (classId: string) => {
  try {
    const response = await prisma.class.findUnique({
      where: { id: classId },
      select: {
        students: true,
      },
    });
    if (!response) {
      throw new Error("class not found");
    }
    if (response.students) {
      return response.students;
    }
    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
});

export const getTotalPublishedTestsByClassId = cache(
  async (classId: string) => {
    try {
      const response = await prisma.class.findUnique({
        where: { id: classId },
        select: {
          BotConfig: true,
        },
      });
      if (!response) {
        throw new Error("class not found");
      }
      if (response.BotConfig) {
        const publishedTest = response.BotConfig.filter(
          (bot) => bot.type === "test" && bot.published
        );
        return publishedTest;
      }
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
);
export type typePublishedTestByClassId = UnwrapPromise<
  ReturnType<typeof getTotalPublishedTestsByClassId>
>;

export const getTotalUnPublishedTestsByClassId = cache(
  async (classId: string) => {
    try {
      const response = await prisma.class.findUnique({
        where: { id: classId },
        select: {
          BotConfig: true,
        },
      });
      if (!response) {
        throw new Error("class not found");
      }
      if (response.BotConfig) {
        const unpublishedTest = response.BotConfig.filter(
          (bot) => bot.type === "test" && !bot.published
        );
        return unpublishedTest;
      }
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
);

export const getTotalPublishedBotsByClassId = cache(async (classId: string) => {
  try {
    const response = await prisma.class.findUnique({
      where: { id: classId },
      select: {
        BotConfig: true,
      },
    });
    if (!response) {
      throw new Error("class not found");
    }
    if (response.BotConfig) {
      const publishedBots = response.BotConfig.filter(
        (bot) => bot.type === "chat" && bot.published
      );
      return publishedBots;
    }
    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
});
export type typePublishedBotByClassId = UnwrapPromise<
  ReturnType<typeof getTotalPublishedBotsByClassId>
>;

export const getTotalUnpublishedBotsByClassId = cache(
  async (classId: string) => {
    try {
      const response = await prisma.class.findUnique({
        where: { id: classId },
        select: {
          BotConfig: true,
        },
      });
      if (!response) {
        throw new Error("class not found");
      }
      if (response.BotConfig) {
        const unpublishedBots = response.BotConfig.filter(
          (bot) => bot.type === "chat" && !bot.published
        );
        return unpublishedBots;
      }
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
);
