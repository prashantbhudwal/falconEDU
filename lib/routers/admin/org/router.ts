"use server";
import prisma from "@/prisma";
import { cache } from "react";
import { isThisWeek } from "date-fns";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { orgRegisterFormSchema } from "@/lib/schema/org-admin";

export const getTeachersWithUserId = cache(
  async ({ userId }: { userId: string }) => {
    try {
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
  },
);

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

export const getAllTeachersInAnOrg = cache(async () => {
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

    type WeeklyData = {
      thisWeek: number;
      prevWeek: number;
      name: string;
    };

    const teacherWeeklyData = new Map<string | null, WeeklyData>();

    orgTeachers.forEach((teacher) => {
      teacher?.BotConfig?.forEach((botConfig) => {
        const teacherId = botConfig.teacherId;
        const teacherName = teacher.User.name || "";

        if (isThisWeek(new Date(botConfig.createdAt))) {
          let existingData = teacherWeeklyData.get(teacherId);

          if (!existingData) {
            // Initialize new record if it doesn't exist
            existingData = {
              thisWeek: 0,
              prevWeek: 0,
              name: teacherName || "",
            };
          }

          teacherWeeklyData.set(teacherId, {
            thisWeek: existingData.thisWeek + 1,
            prevWeek: existingData.prevWeek,
            name: existingData.name,
          });
        }

        const MILLISECONDS_IN_A_WEEK = 7 * 24 * 60 * 60 * 1000;

        const weekAgo = new Date(new Date().getTime() - MILLISECONDS_IN_A_WEEK);
        const taskDate = new Date(botConfig.createdAt);

        const differenceInMilliseconds = weekAgo.getTime() - taskDate.getTime();

        const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;

        const differenceInDays =
          differenceInMilliseconds / MILLISECONDS_IN_A_DAY;

        if (differenceInDays > 0 && differenceInDays < 7) {
          if (teacherWeeklyData.has(teacherId)) {
            teacherWeeklyData.set(teacherId, {
              thisWeek: teacherWeeklyData.get(teacherId)?.thisWeek || 0,
              prevWeek: (teacherWeeklyData.get(teacherId)?.prevWeek || 0) + 1,
              name: teacherWeeklyData.get(teacherId)?.name || teacherName || "",
            });
          } else {
            teacherWeeklyData.set(teacherId, {
              thisWeek: teacherWeeklyData.get(teacherId)?.thisWeek || 0,
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
          if (teacherWeeklyData.has(teacherId)) {
            teacherWeeklyData.set(teacherId, {
              thisWeek: teacherWeeklyData.get(teacherId)?.thisWeek || 0,
              prevWeek: teacherWeeklyData.get(teacherId)?.prevWeek || 0,
              name: teacherWeeklyData.get(teacherId)?.name || teacherName || "",
            });
          } else {
            teacherWeeklyData.set(teacherId, {
              thisWeek: 0,
              prevWeek: 0,
              name: teacherName || "",
            });
          }
        }
      });
    });

    return { orgTeachers, teacherWeeklyData };
  } catch (err) {
    console.error(err);
    return null;
  }
});

export const addTeacherToOrg = async ({ email }: { email: string }) => {
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

    const teacher = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
      },
    });

    if (!teacher) {
      return { teacher: null, found: false };
    }

    const addedTeacher = await prisma.teacherProfile.update({
      where: {
        userId: teacher.id,
      },
      data: {
        orgMode: true,
        orgId: org.org?.id,
      },
    });
    revalidatePath("/dragon/org-admin/add-teachers");
    return { teacher: addedTeacher, found: true };
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const registerOrg = async ({
  values,
  userId,
}: {
  values: z.infer<typeof orgRegisterFormSchema>;
  userId: string;
}) => {
  try {
    let createdBotId: null | string = null;
    const existingBoard = await prisma.board.findFirst({
      where: {
        name: values.boardNames,
      },
    });

    if (!existingBoard) {
      const createdBoards = await prisma.board.create({
        data: {
          name: values.boardNames,
        },
      });
      createdBotId = createdBoards.id;
    }
    const dummyPincode = 123456;

    const createdOrg = await prisma.org.create({
      data: {
        name: values.name,
        type: values.type,
        brandName: values.brandName,
        state: values.state,
        city: values.city,
        pincode: dummyPincode,
        language_medium: values.language_medium,
        language_native: values.language_native,
        board: {
          connect: {
            id: createdBotId || existingBoard?.id,
          },
        },
      },
    });
    if (!createdOrg) {
      return null;
    }

    await prisma.orgAdminProfile.update({
      where: {
        userId: userId,
      },
      data: {
        orgId: createdOrg.id,
      },
    });
    revalidatePath("/dragon/org-admin/");
    return createdOrg;
  } catch (err) {
    console.log(err);
    return null;
  }
};
