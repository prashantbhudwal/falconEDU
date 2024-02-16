import { isAuthorized } from "@/lib/is-authorized";
import prisma from "@/prisma";
import { cache } from "react";

export const allByClassId = cache(async ({ classId }: { classId: string }) => {
  isAuthorized({ userType: "TEACHER" });
  return await prisma.source.findMany({
    where: {
      classes: {
        some: {
          id: classId,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
});

export const allByUserId = cache(async ({ userId }: { userId: string }) => {
  isAuthorized({ userType: "TEACHER" });
  return await prisma.source.findMany({
    where: {
      TeacherProfile: {
        userId: userId,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
});

export const allByTaskId = cache(async ({ taskId }: { taskId: string }) => {
  isAuthorized({ userType: "TEACHER" });
  return await prisma.source.findMany({
    where: {
      BotConfig: {
        some: {
          id: taskId,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
});
