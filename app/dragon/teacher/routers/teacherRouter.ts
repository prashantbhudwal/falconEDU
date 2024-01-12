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
  }
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
  }
);


