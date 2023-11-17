"use server";
import * as z from "zod";
import { getBotsURL, getClassURL } from "@/lib/urls";
import { getClassesURL, getStudentsURL } from "@/lib/urls";
import { getEditBotURL } from "@/lib/urls";
import { isAuthorized } from "@/lib/utils";
import prisma from "@/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function publishBotConfig({
  classId,
  botConfigId,
}: {
  classId: string;
  botConfigId: string;
}) {
  await isAuthorized({
    userType: "TEACHER",
  });
  try {
    const transaction = await prisma.$transaction(async (prisma) => {
      // Step 1: Set published to true for BotConfig
      const updatedBotConfig = await prisma.botConfig.update({
        where: { id: botConfigId },
        data: { published: true },
      });
      if (!updatedBotConfig)
        throw new Error("BotConfig not found or update failed");

      // Step 2: Get class data and teacher's name
      const classData = await prisma.class.findUnique({
        where: { id: classId },
        include: {
          students: true,
          Teacher: {
            include: { User: true },
          },
        },
      });
      if (!classData) throw new Error("Class not found");

      const teacherName = classData.Teacher.User.name || "Unknown";

      // Step 3: Create Bots and BotChats for students if they don't exist
      for (const student of classData.students) {
        const existingBot = await prisma.bot.findFirst({
          where: {
            AND: [{ studentId: student.id }, { botConfigId }],
          },
        });

        if (!existingBot) {
          const newBot = await prisma.bot.create({
            data: {
              studentId: student.id,
              botConfigId,
              name: teacherName,
              BotChat: {
                create: {
                  isDefault: true,
                  messages: [],
                },
              },
            },
          });
          if (!newBot) throw new Error("Failed to create bot");
        }
      }
    });
    const updatedBotConfig = await prisma.botConfig.findUnique({
      where: { id: botConfigId },
    });

    return { success: true, updatedBotConfig };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function unPublishBotConfig({
  classId,
  botConfigId,
}: {
  classId: string;
  botConfigId: string;
}) {
  await isAuthorized({
    userType: "TEACHER",
  });
  try {
    const updatedBotConfig = await prisma.botConfig.update({
      where: {
        id: botConfigId,
      },
      data: {
        published: false,
      },
      include: {
        Class: {
          where: { id: classId },
        },
      },
    });
    return { success: true, updatedBotConfig };
  } catch (error) {
    console.error("Error updating BotConfig:", error);
    throw error;
  }
}
