"use server";

import prisma from "@/prisma";
import { cache } from "react";

export const getTeachersByUserId = cache(async function (userId: string) {
  const userData = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      StudentProfile: {
        select: {
          bot: {
            select: {
              BotConfig: {
                select: {
                  teacher: {
                    select: {
                      id: true,
                      User: {
                        select: {
                          name: true,
                          image: true,
                          email: true, // Add more fields as you need
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const teachers: any[] = [];
  const teacherIds = new Set<string>();

  userData?.StudentProfile?.bot?.forEach((bot) => {
    const teacher = bot.BotConfig.teacher;
    if (teacher && teacher.User && !teacherIds.has(teacher.id)) {
      teacherIds.add(teacher.id);
      teachers.push({ id: teacher.id, ...teacher.User });
    }
  });

  return teachers;
});
