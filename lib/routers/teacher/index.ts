"use server";
import prisma from "@/prisma";
import { cache } from "react";

export const teacherHasOrgMode = cache(
  async ({ userId }: { userId: string }) => {
    const teacherProfile = await prisma.teacherProfile.findUnique({
      where: {
        userId: userId,
      },
      select: {
        orgMode: true,
      },
    });
    if (!teacherProfile) return null;
    return teacherProfile.orgMode;
  },
);

export const getTeacherByTeacherId = cache(
  async ({ teacherId }: { teacherId: string }) => {
    try {
      const teacherProfile = await prisma.teacherProfile.findUnique({
        where: {
          id: teacherId,
        },
      });
      return {
        teacherProfile,
      };
    } catch (err) {
      console.log(err);
      return { teacherProfile: null };
    }
  },
);

export const getClassesByTeacherId = cache(
  async ({ teacherId }: { teacherId: string }) => {
    try {
      const classes = await prisma.class.findMany({
        where: {
          teacherId: teacherId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return classes;
    } catch (err) {
      console.log(err);
      return [];
    }
  },
);

export const getTeacherNameByTeacherId = cache(
  async ({ teacherId }: { teacherId: string }) => {
    try {
      const teacherProfile = await prisma.teacherProfile.findUnique({
        where: {
          id: teacherId,
        },
        select: {
          User: {
            select: {
              name: true,
            },
          },
        },
      });
      return teacherProfile?.User.name;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
);

export const getTeacherId = cache(async function (userId: string) {
  const teacherProfile = await prisma.teacherProfile.findUnique({
    where: { userId },
  });
  return teacherProfile?.id;
});
