import prisma from "@/prisma";
import { cache } from "react";
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
              image: true,
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

export const getReportForStudents = cache(async (studentBotId: string) => {
  try {
    const response = await prisma.botChat.findFirst({
      where: {
        botId: studentBotId,
      },
      select: {
        BotChatQuestions: {
          select: {
            question_number: true,
            student_answer: true,
            correct_answer: true,
            isCorrect: true,
            question: true,
          },
        },
      },
    });
    console.log(response);
    if (response?.BotChatQuestions.length) {
      return response.BotChatQuestions;
    }
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
});
