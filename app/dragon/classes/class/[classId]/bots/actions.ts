"use server";
import prisma from "@/prisma";
import { cache } from "react";
import { revalidatePath } from "next/cache";

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
        classId, // This will connect it to the existing class
        name: botConfigName,
      },
    });
    revalidatePath(`/dragon/classes/class/${classId}/bots`);
    return botConfig;
  } catch (error) {
    console.error("Error: ", error);
  }
}
