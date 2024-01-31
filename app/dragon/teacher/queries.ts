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
  },
);
export type BotConfigs = UnwrapPromise<ReturnType<typeof getBotConfigs>>;

export const getTestResultsByBotChatId = cache(
  async ({ botChatId }: { botChatId: string }) => {
    try {
      const response = await prisma.botChat.findUnique({
        where: {
          id: botChatId,
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
  },
);
export type TestResultsByBotId = UnwrapPromise<
  ReturnType<typeof getTestResultsByBotChatId>
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
  },
);
