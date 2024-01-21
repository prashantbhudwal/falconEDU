"use server";
import prisma from "@/prisma";
import { cache } from "react";

export const getTeacherDetailsByTeacherId = cache(async function (
  teacherId: string,
) {
  const teacher = await prisma.teacherProfile.findUnique({
    where: { id: teacherId },
    select: {
      User: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  return teacher;
});
