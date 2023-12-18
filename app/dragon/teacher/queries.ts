import prisma from "@/prisma";
import { cache } from "react";
export const revalidate = 3600; // 1 hour
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export const getTeacherId = cache(async function (userId: string) {
  const teacherProfile = await prisma.teacherProfile.findUnique({
    where: { userId },
  });
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

export const getBotConfigs = cache(
  async (userId: string, classId: string, configType: string) => {
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
        type: configType.toLocaleLowerCase(),
      },
    });
    return botConfigs;
  }
);
export type BotConfigs = UnwrapPromise<ReturnType<typeof getBotConfigs>>;

export const getStudentsByClassId = cache(async (classId: string) => {
  const students = await prisma.class.findUnique({
    where: { id: classId },
    select: {
      id: true,
      name: true,
      students: {
        select: {
          grade: true,
          id: true,
          User: {
            select: {
              email: true,
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });
  return { students: students?.students, nameOfClass: students?.name };
});

export type StudentsByClassId = UnwrapPromise<
  ReturnType<typeof getStudentsByClassId>
>;

export const getTestResultsByBotId = cache(async (studentBotId: string) => {
  try {
    const response = await prisma.botChat.findFirst({
      where: {
        botId: studentBotId,
      },
      select: {
        BotChatQuestions: {
          select: {
            student_answer: true,
            isCorrect: true,
            parsedQuestionsId: true,
          },
        },
      },
    });
    if (response?.BotChatQuestions.length) {
      return response.BotChatQuestions;
    }
    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
});
export type TestResultsByBotId = UnwrapPromise<
  ReturnType<typeof getTestResultsByBotId>
>;

export const getTotalQuestionByParsedQuestionId = cache(
  async (parsedQuestionId: string) => {
    try {
      const response = await prisma.botChatQuestions.findMany({
        where: {
          parsedQuestionsId: parsedQuestionId,
        },
      });
      return response;
    } catch (err) {
      console.error(err);
    }
  }
);
