"use server";
import { revalidatePath } from "next/cache";
import prisma from "@/prisma";
import { cache } from "react";
import { Entity, EntityActions } from "@/lib/notifications";
import { TaskType } from "@/types";
import { Prisma } from "@prisma/client";
import { generateNameOfClass, getTaskProperties } from "@/lib/helpers";
export const create = async ({ botId }: { botId: string }) => {
  try {
    await prisma.$transaction(async (prisma) => {
      const botChatsCount = await prisma.botChat.count({
        where: { botId },
      });

      const newAttemptNumber = botChatsCount + 1;

      return await prisma.botChat.create({
        data: {
          botId,
          messages: [],
          attemptNumber: newAttemptNumber,
        },
      });
    });
    revalidatePath("/dragon/student");
    return true;
  } catch (error) {
    console.error("Error creating BotChat:", error);
    throw error;
  }
};

export const feedback = cache(async ({ attemptId }: { attemptId: string }) => {
  try {
    const botChat = await prisma.botChat.findUnique({
      where: { id: attemptId },
    });
    const feedback = botChat?.feedbackToStudent;
    return feedback;
  } catch (error) {
    console.error("Error getting feedback for BotChat:", error);
    throw error;
  }
});

export const preferences = cache(async function ({
  attemptId,
}: {
  attemptId: string;
}) {
  const context = await prisma.botChat.findUnique({
    where: { id: attemptId },
    select: {
      bot: {
        select: {
          student: {
            select: {
              preferences: true,
              User: {
                select: {
                  name: true,
                },
              },
            },
          },
          BotConfig: {
            select: {
              preferences: true,
              Class: true,
              teacher: {
                select: {
                  preferences: true,
                  User: {
                    select: {
                      name: true,
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

  if (!context) throw new Error(`Context not found for chatId ${attemptId}`);
  const Class = context?.bot?.BotConfig?.Class;
  if (!Class) throw new Error(`Class not found for chatId ${attemptId}`);
  const grade = Class.grade;

  let configPreferences = context?.bot?.BotConfig?.preferences;
  let teacherPreferences = context?.bot?.BotConfig?.teacher?.preferences;
  let studentPreferences = context?.bot?.student?.preferences;

  return {
    configPreferences,
    teacherPreferences,
    studentPreferences,
  };
});

export const submit = async function ({
  attemptId,
  userId,
}: {
  attemptId: string;
  userId: string;
}) {
  try {
    await prisma.$transaction(async (prisma) => {
      const updatedBotChat = await prisma.botChat.update({
        where: { id: attemptId },
        data: {
          isSubmitted: true,
        },
        include: {
          bot: {
            include: {
              student: {
                include: {
                  User: true,
                },
              },
              BotConfig: {
                include: {
                  Class: {
                    include: {
                      students: true,
                      Teacher: {
                        include: {
                          User: true,
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
      const type = updatedBotChat.bot.BotConfig.type as TaskType;
      const botConfigId = updatedBotChat.bot.BotConfig.id;
      const taskType = getTaskProperties(type).formattedType;
      const taskName = updatedBotChat.bot.BotConfig.name;

      const classData = updatedBotChat.bot.BotConfig.Class;

      if (!classData) throw new Error("Class not found");
      const classId = classData.id;
      const teacherId = classData.Teacher.userId;
      const studentName = updatedBotChat.bot.student.User.name ?? "Student";

      const entityType: Entity = "TASK";
      const entityAction: EntityActions[Entity] = "SUBMIT";
      // Create an event for the student
      const event = await prisma.event.create({
        data: {
          initiatorId: userId,
          entityId: botConfigId,
          entityType,
          action: entityAction,
        },
      });
      const activitiesDataStudent: Prisma.ActivityCreateManyInput[] =
        classData.students.map((student) => ({
          eventId: event.id,
          recipientId: student.userId,
        }));
      await prisma.activity.createMany({
        data: activitiesDataStudent,
        skipDuplicates: true,
      });
      const activity = await prisma.activity.create({
        data: {
          eventId: event.id,
          recipientId: teacherId,
          notifications: {
            create: [
              {
                recipientId: teacherId,
                title: `Submission: ${taskName}`,
                message: `${studentName} from ${generateNameOfClass({ grade: classData.grade, section: classData.section })} submitted the ${taskType}`,
                metadata: JSON.stringify({
                  botConfigId,
                  type,
                  classId,
                  teacherId,
                }),
              },
            ],
          },
        },
      });
    });

    // Create activity for every student in the class

    revalidatePath("/dragon/student");
    return { success: true };
  } catch (error) {
    console.log("Error updating Bot:", error);
    throw new Error("Failed to update Bot");
  }
};

/**
 * Notification logic
 * When a student submits a task
 * - Add an entry to the activity feed of the teacher
 * - Send a notification to the teacher
 * - Add an entry to the activity feed of every student in the class
 */
