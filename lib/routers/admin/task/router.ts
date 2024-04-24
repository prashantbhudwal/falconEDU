"use server";
import prisma from "@/prisma";
import { cache } from "react";
import { formatDateWithTimeZone } from "@/lib/utils";
import {
  isToday,
  isThisWeek,
  isThisMonth,
  compareAsc,
  subDays,
  startOfDay,
} from "date-fns";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/(schools)/api/auth/[...nextauth]/authOptions";

export const getStudentSubmissionsStatsByTaskId = cache(
  async ({ taskId }: { taskId: string }) => {
    try {
      const bots = await prisma.bot.findMany({
        where: { botConfigId: taskId },
        select: {
          id: true,
          isSubmitted: true,
          isChecked: true,
          isActive: true,
          BotChat: {
            where: { isDefault: true },
            select: {
              isRead: true,
            },
          },
          student: {
            select: {
              User: {
                select: {
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
        },
      });

      // console.log(bots);

      if (bots.length === 0) {
        return null;
      }

      const students = bots.map((bot) => ({
        studentBotId: bot.id,
        name: bot.student.User.name,
        email: bot.student.User.email,
        image: bot.student.User.image,
        isSubmitted: bot.isSubmitted,
        isChecked: bot.isChecked,
        isActive: bot.isActive,
        isRead: bot.BotChat.length > 0 ? bot.BotChat[0].isRead : false,
      }));

      return students;
    } catch (err) {
      console.error(err);
      return null;
    }
  },
);

export const getAllPublishedTasksByDate = cache(async () => {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id || "";
    const org = await prisma.orgAdminProfile.findUnique({
      where: {
        userId,
      },
      select: {
        org: true,
      },
    });

    if (!org) {
      return null;
    }

    const publishedTasks = await prisma.teacherProfile.findMany({
      where: {
        orgId: org.org?.id,
      },
      select: {
        BotConfig: {
          where: {
            published: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (publishedTasks.length === 0) {
      return null;
    }

    const allPublishedTask = publishedTasks
      .map((item) => item.BotConfig)
      .flat()
      .sort((a, b) => compareAsc(new Date(a.createdAt), new Date(b.createdAt)));

    const dayWiseChartDataMap = new Map();

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const formattedDate = formatDateWithTimeZone({
        createdAt: date,
        dateFormat: "dd MMM",
      });

      dayWiseChartDataMap.set(formattedDate, 0);
    }

    allPublishedTask.forEach((botConfig) => {
      const day = formatDateWithTimeZone({
        createdAt: botConfig.createdAt,
        dateFormat: "dd MMM",
      });
      if (dayWiseChartDataMap.has(day)) {
        dayWiseChartDataMap.set(day, dayWiseChartDataMap.get(day) + 1);
      }
    });

    const dayWiseChartData = Array.from(dayWiseChartDataMap).map(
      ([key, value]) => {
        return {
          day: key as string,
          ["Total Tasks"]: value as number,
        };
      },
    );

    const dayWiseData = new Map();
    // dayWiseData.set("Today", 0);
    dayWiseData.set("This Week", 0);
    dayWiseData.set("This Month", 0);

    allPublishedTask.forEach((task) => {
      // if (isToday(new Date(task.createdAt))) {
      //   if (dayWiseData.has("Today")) {
      //     dayWiseData.set("Today", dayWiseData.get("Today") + 1);
      //   } else {
      //     dayWiseData.set("Today", 1);
      //   }
      // }

      if (isThisWeek(new Date(task.createdAt))) {
        if (dayWiseData.has("This Week")) {
          dayWiseData.set("This Week", dayWiseData.get("This Week") + 1);
        } else {
          dayWiseData.set("This Week", 1);
        }
      }

      if (isThisMonth(new Date(task.createdAt))) {
        if (dayWiseData.has("This Month")) {
          dayWiseData.set("This Month", dayWiseData.get("This Month") + 1);
        } else {
          dayWiseData.set("This Month", 1);
        }
      }
    });

    return { allPublishedTask, dayWiseChartData, dayWiseData };
  } catch (err) {
    console.error(err);
    return null;
  }
});
