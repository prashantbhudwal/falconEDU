"use server";
import prisma from "@/prisma";
import { cache } from "react";
import { db } from ".";

export const getTeacherBrandNameByUserId = cache(
  async ({ userId }: { userId: string }) => {
    try {
      const teacherProfile = await prisma.teacherProfile.findUnique({
        where: {
          userId: userId,
        },
        select: {
          orgId: true,
        },
      });
      if (!teacherProfile) return { orgBrandName: null };
      const orgId = teacherProfile?.orgId;
      if (!orgId) return { orgBrandName: null };

      const teacherOrg = await prisma.org.findUnique({
        where: {
          id: orgId,
        },
        select: {
          brandName: true,
        },
      });
      return {
        orgBrandName: teacherOrg?.brandName,
      };
    } catch (err) {
      console.log(err);
      return { orgBrandName: null };
    }
  }
);

export const getStudentBrandNameByUserId = cache(
  async ({ userId }: { userId: string }) => {
    try {
      const studentProfile = await prisma.studentProfile.findUnique({
        where: {
          userId: userId,
        },
        select: {
          orgId: true,
        },
      });
      if (!studentProfile) return { orgBrandName: null };
      const orgId = studentProfile?.orgId;
      if (!orgId) return { orgBrandName: null };

      const studentOrg = await prisma.org.findUnique({
        where: {
          id: orgId,
        },
        select: {
          brandName: true,
        },
      });
      return {
        orgBrandName: studentOrg?.brandName,
      };
    } catch (err) {
      console.log(err);
      return { orgBrandName: null };
    }
  }
);
