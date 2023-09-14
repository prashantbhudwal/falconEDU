import prisma from "@/prisma";
import { cache } from "react";
import * as z from "zod";
import { basicBotInfoSchema } from "./schema";
export const revalidate = 3600; // 1 hour

export const getTeacherId = cache(async function (userId: string) {
  console.log("getTeacherId function starts");
  const teacherProfile = await prisma.teacherProfile.findUnique({
    where: { userId },
  });
  console.log("getTeacherId function ends", teacherProfile?.id);
  return teacherProfile?.id;
});

export const getClassesByUserId = cache(async function (userId: string) {
  const teacherProfile = await prisma.teacherProfile.findUnique({
    where: { userId },
  });

  if (!teacherProfile) {
    throw new Error(`TeacherProfile with userId ${userId} not found`);
  }

  const classes = await prisma.class.findMany({
    where: {
      teacherId: teacherProfile.id,
    },
  });

  return classes;
});

export const getBotConfigs = cache(async (userId: string, classId: string) => {
  const teacherProfile = await prisma.teacherProfile.findUnique({
    where: { userId },
  });

  if (!teacherProfile) {
    throw new Error(`TeacherProfile with userId ${userId} not found`);
  }
  const botConfigs = await prisma.botConfig.findMany({
    where: {
      teacherId: teacherProfile.id,
      classId,
    },
  });
  return botConfigs;
});

const emptyPreferences = {}; // or whatever default you want

export const fetchBotConfig = cache(async (botId: string) => {
  try {
    const bot = await prisma.botConfig.findUnique({
      where: { id: botId },
    });

    console.log("Fetched successfully.");

    let preferences;
    if (bot && bot.preferences) {
      preferences =
        typeof bot.preferences === "string"
          ? JSON.parse(bot.preferences)
          : bot.preferences;
    } else {
      preferences = emptyPreferences;
    }

    const result = basicBotInfoSchema.safeParse(preferences);

    if (result.success) {
      return result.data;
    } else {
      console.error("Validation failed:", result.error);
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch:", error);
    return null;
  }
});

export const getStudentsByClassId = cache(async (classId: string) => {
  const students = await prisma.class.findUnique({
    where: { id: classId },
    select: {
      students: {
        select: {
          grade: true,
          id: true,
          classId: true,
          User: {
            select: {
              email: true,
              name: true,
            },
          },
        },
      },
    },
  });
  return students?.students;
});
//Export return type of this function by infering the type of the return value of the function
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export type StudentsByClassId = UnwrapPromise<
  ReturnType<typeof getStudentsByClassId>
>;
