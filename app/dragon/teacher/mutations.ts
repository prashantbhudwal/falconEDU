"use server";
import prisma from "@/prisma";
import { cache } from "react";
import { revalidatePath } from "next/cache";
import { getBotsURL } from "@/lib/urls";
import { basicBotInfoSchema } from "./schema";
import { getEditBotURL } from "@/lib/urls";
import * as z from "zod";
import { getClassesURL } from "@/lib/urls";

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
  revalidatePath(getClassesURL());
  return newClass;
};

export async function createBotConfig(
  userId: string,
  classId: string,
  botConfigName: string
) {
  const teacherProfile = await prisma.teacherProfile.findUnique({
    where: { userId },
  });

  if (!teacherProfile) {
    throw new Error(`TeacherProfile with userId ${userId} not found`);
  }
  try {
    const botConfig = await prisma.botConfig.create({
      data: {
        teacherId: teacherProfile.id,
        classId,
        name: botConfigName,
      },
    });
    revalidatePath(getBotsURL(classId));
    return botConfig;
  } catch (error) {
    console.error("Error: ", error);
  }
}

export const updateBotConfig = async (
  classId: string,
  botId: string,
  data: z.infer<typeof basicBotInfoSchema>
): Promise<{ success: boolean; error?: any }> => {
  try {
    const result = await prisma.botConfig.update({
      where: { id: botId },
      data: {
        preferences: JSON.stringify(data),
      },
    });
    revalidatePath(getEditBotURL(classId, botId));
    return { success: true };
  } catch (error) {
    console.error("Failed to update:", error);
    console.log("Failed to update:", error);
    return { success: false, error };
  }
};
