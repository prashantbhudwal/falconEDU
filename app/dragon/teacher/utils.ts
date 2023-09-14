import prisma from "@/prisma";
import { cache } from "react";

export const getTeacherId = cache(async function (userId: string) {
  console.log("getTeacherId function starts");
  const teacherProfile = await prisma.teacherProfile.findUnique({
    where: { userId },
  });
  console.log("getTeacherId function ends", teacherProfile?.id);
  return teacherProfile?.id;
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
