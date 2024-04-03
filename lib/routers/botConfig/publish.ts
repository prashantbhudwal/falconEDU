"use server";
import { getTaskProperties } from "@/lib/helpers";
import { isAuthorized } from "@/lib/is-authorized";
import prisma from "@/prisma";
import { TaskType } from "@/types";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { PublishResult } from "./publish.types";
import { Entity, EntityActions } from "@/lib/notifications";
import {
  createBotChats,
  createBots,
  fetchClassAndTeacherData,
  fetchExistingBotsForStudents,
  validateBotConfig,
} from "./publish-helpers";
// The frontend works with these types. If you change them, you'll need to update the frontend as well.

export async function publish({
  classId,
  botConfigId,
  type,
}: {
  classId: string;
  botConfigId: string;
  type: TaskType;
}): Promise<PublishResult> {
  await isAuthorized({
    userType: "TEACHER",
  });
  try {
    const validatedConfig = await validateBotConfig(botConfigId, type);

    if (!validatedConfig.isActive) {
      return {
        success: false,
        message: `Can't Publish an Archived ${
          getTaskProperties(type).formattedType
        }`,
        updatedBotConfig: null,
      };
    }
    const { classData, teacherName, teacherId } =
      await fetchClassAndTeacherData(classId);

    const userIdTeacher = classData.Teacher.userId;

    const studentIds = classData.students.map((student) => student.id);

    const studentIdsWithExistingBots = await fetchExistingBotsForStudents(
      botConfigId,
      studentIds,
    );

    const studentIdsWithoutBots = classData.students
      .filter((student) => !studentIdsWithExistingBots.has(student.id))
      .map((student) => student.id);

    await prisma.$transaction(async (prisma) => {
      if (studentIdsWithoutBots.length > 0) {
        const createdBots = await createBots(
          studentIdsWithoutBots,
          botConfigId,
          teacherName,
        );

        await createBotChats(createdBots);
      }
      await prisma.botConfig.update({
        where: { id: botConfigId },
        data: { published: true },
      });

      // Logic for events, activity feed, and notifications

      const entityType: Entity = "TASK";
      const entityAction: EntityActions[Entity] = "PUBLISH";

      // Create an event for the teacher
      const event = await prisma.event.create({
        data: {
          initiatorId: userIdTeacher,
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

      // Create notifications for every student in the class
    });
    const updatedBotConfig = await prisma.botConfig.findUnique({
      where: { id: botConfigId },
    });

    revalidatePath("/dragon/teacher/class");

    return {
      success: true,
      message: "Published Successfully",
      updatedBotConfig: updatedBotConfig,
    };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
