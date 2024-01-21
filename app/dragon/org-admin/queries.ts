"use server";
import { formatDateWithTimeZone } from "@/lib/utils";
import {
  isToday,
  isThisWeek,
  isThisMonth,
  compareAsc,
  subDays,
  startOfDay,
} from "date-fns";
import prisma from "@/prisma";
import { cache } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { UnwrapPromise } from "../student/queries";

const getUserId: () => Promise<string> = async () => {
  const session = await getServerSession(authOptions);
  return session?.user.id || "";
}; //TODO: dont use this function to get userId pass from the layout to all components

export const getAllPublishedTasksByDate = cache(async () => {
  try {
    const userId = await getUserId();
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

// ----------------------------------------------------------------------------------------------------------------------------------------------------------

export const getAllTeachersInAnOrg = cache(async () => {
  try {
    const userId = await getUserId();
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

    const orgTeachers = await prisma.teacherProfile.findMany({
      where: {
        orgId: org.org?.id,
      },
      select: {
        User: true,
        BotConfig: {
          where: {
            published: true,
          },
        },
      },
    });

    if (orgTeachers.length === 0) {
      return null;
    }

    const teacherWeekyData = new Map<
      string | null,
      { thisWeek: number; prevWeek: number; name: string }
    >();

    orgTeachers.forEach((teacher) => {
      teacher?.BotConfig.forEach((botConfig) => {
        const teacherId = botConfig.teacherId;
        const teacherName = teacher.User.name || "";
        ////////////////////////////////////////////////////////////////
        if (isThisWeek(new Date(botConfig.createdAt))) {
          if (teacherWeekyData.has(teacherId)) {
            teacherWeekyData.set(teacherId, {
              thisWeek: (teacherWeekyData.get(teacherId)?.thisWeek || 0) + 1,
              prevWeek: teacherWeekyData.get(teacherId)?.prevWeek || 0,
              name: teacherWeekyData.get(teacherId)?.name || teacherName || "",
            });
          } else {
            teacherWeekyData.set(teacherId, {
              thisWeek: 1,
              prevWeek: teacherWeekyData.get(teacherId)?.prevWeek || 0,
              name: teacherName || "",
            });
          }
        }

        const weekAgo = new Date(
          new Date().getTime() - 7 * 24 * 60 * 60 * 1000,
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
              name: teacherWeekyData.get(teacherId)?.name || teacherName || "",
            });
          } else {
            teacherWeekyData.set(teacherId, {
              thisWeek: teacherWeekyData.get(teacherId)?.thisWeek || 0,
              prevWeek: 1,
              name: teacherName || "",
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
              name: teacherWeekyData.get(teacherId)?.name || teacherName || "",
            });
          } else {
            teacherWeekyData.set(teacherId, {
              thisWeek: 0,
              prevWeek: 0,
              name: teacherName || "",
            });
          }
        }
      });
    });

    return { orgTeachers, teacherWeekyData };
  } catch (err) {
    console.error(err);
    return null;
  }
});

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

export const getTeacherWithOrgId = cache(async () => {
  try {
    const userId = await getUserId();
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

    const teachers = await prisma.teacherProfile.findMany({
      where: {
        orgId: org.org?.id,
      },
      include: {
        User: true,
      },
    }); // or find teachers from orgId

    return teachers;
  } catch (err) {
    console.error(err);
    return null;
  }
});

export const getTeacherTasksWithTeacherId = cache(
  async ({ teacherId }: { teacherId: string }) => {
    try {
      const teacher = await prisma.teacherProfile.findUnique({
        where: {
          id: teacherId,
        },
        select: {
          User: {
            select: {
              name: true,
            },
          },
          BotConfig: {
            where: {
              published: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
          Class: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      if (!teacher) return null;

      return {
        tasks: teacher.BotConfig,
        classes: teacher.Class,
        name: teacher.User.name,
      };
    } catch (err) {
      console.log(err);
      return null;
    }
  },
);

export type TeacherTask = UnwrapPromise<
  ReturnType<typeof getTeacherTasksWithTeacherId>
>;

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
