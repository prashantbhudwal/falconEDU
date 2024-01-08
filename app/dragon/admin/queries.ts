"use server";
import { formatDateWithTimeZone } from "@/lib/utils";
import { isToday, isThisWeek, isThisMonth } from "date-fns";
import prisma from "@/prisma";

export const getAllPublishedTasksByDate = async () => {
  try {
    const publishedTasks = await prisma.botConfig.findMany({
      where: {
        published: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    if (publishedTasks.length === 0) {
      return null;
    }
    const dayWiseChartDataMap = new Map();
    const dayWiseData = new Map();
    dayWiseData.set("Today", 0);
    dayWiseData.set("This Week", 0);
    dayWiseData.set("This Month", 0);

    publishedTasks.forEach((botConfig) => {
      const day = formatDateWithTimeZone({
        createdAt: botConfig.createdAt,
        dateFormat: "dd MMM",
      });
      if (dayWiseChartDataMap.has(day)) {
        dayWiseChartDataMap.set(day, dayWiseChartDataMap.get(day) + 1);
      } else {
        dayWiseChartDataMap.set(day, 1);
      }
    });

    const dayWiseChartData = Array.from(dayWiseChartDataMap).map(
      ([key, value]) => {
        return {
          day: key as string,
          ["Total Tasks"]: value as number,
        };
      }
    );

    // const todayTasks = publishedTasks.filter((task) => isToday(new Date(task.createdAt)));
    publishedTasks.forEach((task) => {
      if (isToday(new Date(task.createdAt))) {
        if (dayWiseData.has("Today")) {
          dayWiseData.set("Today", dayWiseData.get("Today") + 1);
        } else {
          dayWiseData.set("Today", 1);
        }
      }

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

    return { publishedTasks, dayWiseChartData, dayWiseData };
  } catch (err) {
    console.error(err);
    return null;
  }
};
