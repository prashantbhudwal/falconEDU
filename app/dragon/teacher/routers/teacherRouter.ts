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
