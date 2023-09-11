"use server";
import prisma from "@/prisma";
import { cache } from "react";
import { revalidatePath } from "next/cache";
export const createClassForTeacher = async function (
  className: string,
  userId: string
) {
  // Step 1: Fetch TeacherProfile based on userId
  const teacherProfile = await prisma.teacherProfile.findUnique({
    where: { userId },
  });

  if (!teacherProfile) {
    throw new Error(`TeacherProfile with userId ${userId} not found`);
  }

  // Step 2: Create new class
  const newClass = await prisma.class.create({
    data: {
      name: className,
      teacherId: teacherProfile.id, // Using the id of TeacherProfile
    },
  });
  revalidatePath("/dragon/classes/");
  return newClass;
};

const getTeacherId = cache(async function (userId: string) {
  const teacherProfile = await prisma.teacherProfile.findUnique({
    where: { userId },
  });
});
