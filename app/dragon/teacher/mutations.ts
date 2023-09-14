"use server";
import prisma from "@/prisma";
import { cache } from "react";
import { revalidatePath } from "next/cache";
import { getBotsURL } from "@/lib/urls";
import { basicBotInfoSchema } from "./schema";
import { getEditBotURL } from "@/lib/urls";
import * as z from "zod";
import { getClassesURL, getStudentsURL } from "@/lib/urls";

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

export const toggleBotPublishBotConfig = async (
  classId: string,
  botId: string
): Promise<{ success: boolean; error?: any }> => {
  try {
    // First, fetch the current 'published' status of the bot
    const bot = await prisma.botConfig.findUnique({
      where: { id: botId },
      select: { published: true },
    });

    if (!bot) {
      console.error("Bot not found");
      return { success: false, error: "Bot not found" };
    }

    // Toggle the 'published' status
    const newPublishedStatus = !bot.published;

    // Update the 'published' status in the database
    await prisma.botConfig.update({
      where: { id: botId },
      data: {
        published: newPublishedStatus,
      },
    });

    revalidatePath(getEditBotURL(classId, botId));

    return { success: true };
  } catch (error) {
    console.error("Failed to update:", error);
    return { success: false, error };
  }
};

export const addStudentToClass = async (email: string, classId: string) => {
  try {
    // Check if user exists and is a student
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, userType: true },
    });

    if (!user || user.userType !== "STUDENT") {
      return { notFound: true };
    }

    // Check if student profile exists, create if not
    //TODO Fix this in the db to avoid this hack
    let studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: user.id },
    });

    if (!studentProfile) {
      studentProfile = await prisma.studentProfile.create({
        data: {
          userId: user.id,
          grade: "",
        },
      });
    }

    // Add student to class
    await prisma.class.update({
      where: { id: classId },
      data: {
        students: {
          connect: { id: studentProfile.id },
        },
      },
    });
    revalidatePath(getStudentsURL(classId));
    return { success: true };
  } catch (error) {
    console.error("Error adding student to class:", error);
    return { error: true };
  }
};
/* Same as above, but using transaction
const addStudentToClass = async (email: string, classId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, userType: true },
    });

    if (!user || user.userType !== "STUDENT") {
      return { notFound: true };
    }

    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: user.id },
    });

    const operations = [];

    if (!studentProfile) {
      operations.push(
        prisma.studentProfile.create({
          data: { userId: user.id },
        })
      );
    }

    operations.push(
      prisma.class.update({
        where: { id: classId },
        data: {
          students: {
            connect: { userId: user.id },
          },
        },
      })
    );

    await prisma.$transaction(operations);
    
    return { success: true };
  } catch (error) {
    console.error("Error:", error);
    return { error: true };
  }
};

 */

export const removeStudentFromClass = async (
  studentId: string,
  classId: string
) => {
  try {
    // Remove student from class
    await prisma.class.update({
      where: { id: classId },
      data: {
        students: {
          disconnect: { id: studentId },
        },
      },
    });
    revalidatePath(getStudentsURL(classId));
    return { success: true };
  } catch (error) {
    console.error("Error removing student from class:", error);
    return { error: true };
  }
};
