import "server-only";
import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "../trpc";
import prisma from "@/prisma";
import { isAuthorized } from "@/lib/is-authorized";
import { revalidatePath } from "next/cache";
import { getBotsURL, getTaskUrl } from "@/lib/urls";
import { TaskType } from "@/types/dragon";

export const botConfigRouter = createTRPCRouter({
  publishBotConfig: publicProcedure
    .input(
      z.object({
        classId: z.string(),
        botConfigId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { classId, botConfigId } = input;
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
    }),

  unPublishBotConfig: publicProcedure
    .input(
      z.object({
        classId: z.string(),
        botConfigId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { classId, botConfigId } = input;
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
    }),

  createBotConfig: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        classId: z.string(),
        configName: z.string(),
        configType: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { userId, classId, configName, configType } = input;
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
    }),

  updateBotConfig: publicProcedure
    .input(
      z.object({
        classId: z.string(),
        botId: z.string(),
        data: z.any(), // Adjust based on ConfigTypeSchemaMap
        configType: z.union([z.literal("chat"), z.literal("test")]),
      })
    )
    .mutation(async ({ input }) => {
      const { classId, botId, data, configType } = input;
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
        revalidatePath(
          getTaskUrl({ classId, taskId: botId, type: configType })
        );
        return { success: true };
      } catch (error) {
        console.error("Failed to update:", error);
        return { success: false, error };
      }
    }),

  updateBotConfigName: publicProcedure
    .input(
      z.object({
        classId: z.string(),
        botId: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { classId, botId, name } = input;
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
        revalidatePath(
          getTaskUrl({ classId, taskId: botId, type: result.type as TaskType })
        );
        return { success: true };
      } catch (error) {
        console.error("Failed to update:", error);
        return { success: false, error };
      }
    }),
});
