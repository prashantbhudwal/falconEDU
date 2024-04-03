"use server";
import prisma from "@/prisma";
import { revalidatePath } from "next/cache";
import { getTaskResponsesUrlByType, url } from "@/lib/urls";
import { TaskType } from "@/types";
import { Entity } from "@/lib/notifications";

export const byRecipient = async function ({
  recipientId,
}: {
  recipientId: string;
}) {
  const notifications = await prisma.notification.findMany({
    where: {
      recipientId,
    },
    select: {
      id: true,
      title: true,
      message: true,
      isRead: true,
      activity: {
        select: {
          event: {
            select: {
              entityType: true,
              entityId: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return notifications;
};

export const markAsRead = async ({ ids }: { ids: string[] }) => {
  await prisma.notification.updateMany({
    where: {
      id: {
        in: ids,
      },
    },
    data: {
      isRead: true,
    },
  });
  revalidatePath(url.teacher.settings.notifications);
};

export const hasUnread = async ({ recipientId }: { recipientId: string }) => {
  const unreadNotifications = await prisma.notification.count({
    where: {
      recipientId,
      isRead: false,
    },
  });
  const hasUnread = unreadNotifications > 0;
  return { hasUnread, unreadNotificationsCount: unreadNotifications };
};

export const notificationUrl = async (entityType: Entity, entityId: string) => {
  if (entityType === "TASK") {
    const task = await prisma.botConfig.findUnique({
      where: {
        id: entityId,
      },
    });
    const type = task?.type as TaskType;
    const classId = task?.classId as string;
    const configId = task?.id as string;
    return getTaskResponsesUrlByType({ type, classId, configId });
  }
  return "";
};
