"use server";
import { formatDateWithTimeZone } from "@/lib/utils";
import { isToday, isThisWeek, isThisMonth, compareAsc } from "date-fns";
import prisma from "@/prisma";
import { cache } from "react";

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

export const getAllTeachersInAnOrg = async () => {
  try {
    const teachers = await prisma.user.findMany({
      where: {
        userType: "TEACHER",
      },
      select: {
        name: true,
        teacherProfile: {
          select: {
            id: true,
            BotConfig: {
              where: {
                published: true,
              },
            },
          },
        },
      },
    });
    if (teachers.length === 0) {
      return null;
    }

    const teacherWeekyData = new Map<
      string | null,
      { thisWeek: number; prevWeek: number; name: string }
    >();

    teachers.forEach((teacher) => {
      teacher.teacherProfile?.BotConfig.forEach((botConfig) => {
        const teacherId = botConfig.teacherId;
        ////////////////////////////////////////////////////////////////
        if (isThisWeek(new Date(botConfig.createdAt))) {
          if (teacherWeekyData.has(teacherId)) {
            teacherWeekyData.set(teacherId, {
              thisWeek: (teacherWeekyData.get(teacherId)?.thisWeek || 0) + 1,
              prevWeek: teacherWeekyData.get(teacherId)?.prevWeek || 0,
              name: teacherWeekyData.get(teacherId)?.name || teacher.name || "",
            });
          } else {
            teacherWeekyData.set(teacherId, {
              thisWeek: 1,
              prevWeek: teacherWeekyData.get(teacherId)?.prevWeek || 0,
              name: teacher.name || "",
            });
          }
        }

        const weekAgo = new Date(
          new Date().getTime() - 7 * 24 * 60 * 60 * 1000
        );
        const taskDate = new Date(botConfig.createdAt);

        const differenceInMilliseconds = weekAgo.getTime() - taskDate.getTime();
        const differenceInDays =
          differenceInMilliseconds / (1000 * 60 * 60 * 24);

        if (differenceInDays > 0 && differenceInDays < 7) {
          if (teacherWeekyData.has(teacherId)) {
            teacherWeekyData.set(teacherId, {
              thisWeek: teacherWeekyData.get(teacherId)?.thisWeek || 0,
              prevWeek: (teacherWeekyData.get(teacherId)?.prevWeek || 0) + 1,
              name: teacherWeekyData.get(teacherId)?.name || teacher.name || "",
            });
          } else {
            teacherWeekyData.set(teacherId, {
              thisWeek: teacherWeekyData.get(teacherId)?.thisWeek || 0,
              prevWeek: 1,
              name: teacher.name || "",
            });
          }
        }

        if (
          !(
            differenceInDays > 0 &&
            differenceInDays < 7 &&
            isThisWeek(new Date(botConfig.createdAt))
          )
        ) {
          if (teacherWeekyData.has(teacherId)) {
            teacherWeekyData.set(teacherId, {
              thisWeek: teacherWeekyData.get(teacherId)?.thisWeek || 0,
              prevWeek: teacherWeekyData.get(teacherId)?.prevWeek || 0,
              name: teacherWeekyData.get(teacherId)?.name || teacher.name || "",
            });
          } else {
            teacherWeekyData.set(teacherId, {
              thisWeek: 0,
              prevWeek: 0,
              name: teacher.name || "",
            });
          }
        }
      });
    });

    return { teachers, teacherWeekyData };
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getOrgByUserId = cache(async (userId: string) => {
  try {
    const admin = await prisma.orgAdminProfile.findUnique({
      where: {
        userId: userId,
      },
      include: {
        org: {
          select: {
            id: true,
            name: true,
            type: true,
            teacher: true,
          },
        },
      },
    });

    if (!admin?.org) {
      return null;
    }

    return admin.org;
  } catch (err) {
    console.log(err);
    return null;
  }
});
