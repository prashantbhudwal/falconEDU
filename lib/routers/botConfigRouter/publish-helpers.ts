import { getTaskProperties } from "@/lib/helpers";
import { Entity, EntityActions } from "@/lib/notifications";
import prisma from "@/prisma";
import { TaskType } from "@/types";
import { Prisma } from "@prisma/client";

export async function validateBotConfig(botConfigId: string, type: TaskType) {
  const botConfig = await prisma.botConfig.findUnique({
    where: { id: botConfigId },
    select: { isActive: true, type: true },
  });
  if (!botConfig) throw new Error(`BotConfig not found`);
  return botConfig;
}

export async function fetchClassAndTeacherData(classId: string) {
  const classData = await prisma.class.findUnique({
    where: { id: classId },
    include: {
      students: true,
      Teacher: { include: { User: true } },
    },
  });
  if (!classData) throw new Error("Class not found");
  const teacherName = classData.Teacher.User.name ?? "Unknown";
  const teacherId = classData.Teacher.userId;
  return { classData, teacherName, teacherId };
}

export async function fetchExistingBotsForStudents(
  botConfigId: string,
  studentIds: string[],
) {
  const existingBots = await prisma.bot.findMany({
    where: {
      botConfigId,
      studentId: { in: studentIds },
    },
    select: { studentId: true },
  });
  return new Set(existingBots.map((bot) => bot.studentId));
}

export async function createBots(
  studentIds: string[],
  botConfigId: string,
  teacherName: string,
) {
  const botsToCreate: Prisma.BotCreateManyInput[] = studentIds.map(
    (studentId) => ({
      studentId,
      botConfigId,
      name: teacherName,
    }),
  );

  await prisma.bot.createMany({
    data: botsToCreate,
    skipDuplicates: true,
  });

  return prisma.bot.findMany({
    where: {
      botConfigId: botConfigId,
      studentId: { in: studentIds },
    },
    select: {
      id: true,
    },
  });
}

export async function createBotChats(bots: { id: string }[]) {
  const botChatsToCreate: Prisma.BotChatCreateManyInput[] = bots.map((bot) => ({
    botId: bot.id,
    isDefault: true,
    messages: JSON.stringify([]),
  }));

  if (botChatsToCreate.length > 0) {
    return prisma.botChat.createMany({
      data: botChatsToCreate,
      skipDuplicates: true,
    });
  }
}

export const createEventAndActivities = async (
  teacherId: string,
  botConfigId: string,
  classId: string,
  type: TaskType,
  classData: {
    students: { userId: string }[];
  },
) => {
  const entityType: Entity = "TASK";
  const entityAction: EntityActions[Entity] = "PUBLISH";

  // Create an event for the teacher
  const event = await prisma.event.create({
    data: {
      initiatorId: teacherId,
      entityId: botConfigId,
      entityType,
      action: entityAction,
    },
  });

  // Create activity for every student in the class

  const activitiesData: Prisma.ActivityCreateManyInput[] =
    classData.students.map((student) => ({
      eventId: event.id,
      recipientId: student.userId,
    }));

  await prisma.activity.createMany({
    data: activitiesData,
    skipDuplicates: true,
  });

  const activities = await prisma.activity.findMany({
    where: {
      eventId: event.id,
      recipientId: {
        in: classData.students.map((student) => student.userId),
      },
    },
    select: {
      id: true,
      recipientId: true,
    },
  });

  const notificationsData: Prisma.NotificationCreateManyInput[] =
    activities.map((activity) => ({
      activityId: activity.id,
      recipientId: activity.recipientId,
      title: `Teacher assigned a new ${getTaskProperties(type).formattedType}`,
      message: `Click here to view the task.`,
      metadata: JSON.stringify({
        botConfigId,
        type,
        classId,
        teacherId,
      }),
    }));

  await prisma.notification.createMany({
    data: notificationsData,
    skipDuplicates: true,
  });
};
