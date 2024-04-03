"use server";
import prisma from "@/prisma";
import { cache } from "react";

export const getTeacherTasksWithTeacherId = cache(
  async ({ teacherId }: { teacherId: string }) => {
    try {
      const teacher = await prisma.teacherProfile.findUnique({
        where: {
          id: teacherId,
        },
        select: {
          User: {
            select: {
              name: true,
            },
          },
          BotConfig: {
            where: {
              published: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
          Class: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      if (!teacher) return null;

      return {
        tasks: teacher.BotConfig,
        classes: teacher.Class,
        name: teacher.User.name,
      };
    } catch (err) {
      console.log(err);
      return null;
    }
  },
);

