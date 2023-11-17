"use server";
import * as z from "zod";
import { getBotsURL, getClassURL } from "@/lib/urls";
import { getClassesURL, getStudentsURL } from "@/lib/urls";
import { getEditBotURL } from "@/lib/urls";
import { isAuthorized } from "@/lib/utils";
import prisma from "@/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { botPreferencesSchema, testBotPreferencesSchema } from "../../schema";
type BotPreferencesSchemaType = z.infer<typeof botPreferencesSchema>;
type TestBotPreferencesSchemaType = z.infer<typeof testBotPreferencesSchema>;
type ConfigTypeSchemaMap = {
  chat: BotPreferencesSchemaType;
  test: TestBotPreferencesSchemaType;
};

export const publishBotConfig = async function ({
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
};

export const unPublishBotConfig = async function ({
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
};
export const createBotConfig = async function ({
  userId,
  classId,
  configName,
  configType,
}: {
  userId: string;
  classId: string;
  configName: string;
  configType: string;
}) {
  await isAuthorized({
    userType: "TEACHER",
  });
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
        name: configName,
        type: configType.toLocaleLowerCase(),
      },
    });
    revalidatePath(getBotsURL(classId));
    return botConfig;
  } catch (error) {
    console.error("Error: ", error);
  }
};
export const updateBotConfig = async function <T extends "chat" | "test">({
  classId,
  botId,
  data,
  configType,
}: {
  classId: string;
  botId: string;
  data: ConfigTypeSchemaMap[T];
  configType: T;
}): Promise<{ success: boolean; error?: any }> {
  await isAuthorized({
    userType: "TEACHER",
  });
  try {
    const result = await prisma.botConfig.update({
      where: { id: botId },
      data: {
        preferences: data,
      },
    });
    revalidatePath(getEditBotURL(classId, botId));
    return { success: true };
  } catch (error) {
    console.error("Failed to update:", error);
    return { success: false, error };
  }
};
export const updateBotConfigName = async function ({
  classId,
  botId,
  name,
}: {
  classId: string;
  botId: string;
  name: string;
}): Promise<{ success: boolean; error?: any }> {
  await isAuthorized({
    userType: "TEACHER",
  });
  try {
    const result = await prisma.botConfig.update({
      where: { id: botId },
      data: {
        name: name,
      },
    });
    revalidatePath(getEditBotURL(classId, botId));
    return { success: true };
  } catch (error) {
    console.error("Failed to update:", error);
    return { success: false, error };
  }
};
