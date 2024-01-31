"use server";
import { isAuthorized } from "@/lib/is-authorized";
import { getClassesURL } from "@/lib/urls";
import prisma from "@/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cache } from "react";
import { UnwrapPromise } from "../../app/dragon/student/queries";
import { Class } from "@prisma/client";

export const createClassForTeacher = async function ({
  grade,
  section,
  userId,
}: {
  grade: Class["grade"];
  section: Class["section"];
  userId: string;
}) {
  await isAuthorized({
    userType: "TEACHER",
  });
  // Step 1: Fetch TeacherProfile based on userId
  const teacherProfile = await prisma.teacherProfile.findUnique({
    where: { userId },
  });

  if (!teacherProfile) {
    throw new Error(`TeacherProfile with userId ${userId} not found`);
  }

  // Step 2: Create new class
  const newClass = await prisma.class.create({
    data: {
      teacherId: teacherProfile.id, // Using the id of TeacherProfile
      grade,
      section,
    },
  });
  revalidatePath(getClassesURL());
  return newClass;
};

export const updateClassForTeacher = async function ({
  grade,
  section,
  classId,
}: {
  grade: Class["grade"];
  section: Class["section"];
  classId: string;
}) {
  await isAuthorized({
    userType: "TEACHER",
  });
  // Step 1: Fetch TeacherProfile based on userId

  // Step 2: Create new class
  const newClass = await prisma.class.update({
    where: { id: classId },
    data: {
      grade,
      section,
    },
  });
  revalidatePath(getClassesURL());
  return newClass;
};

export const deleteClassByClassId = (classId: string) => {
  deleteClass(classId);
  redirect("/dragon/teacher");
};

export const deleteClass = async (classId: string) => {
  try {
    const existingClass = await prisma.class.findUnique({
      where: { id: classId },
    });

    if (!existingClass) {
      throw new Error(`Class with ID ${classId} not found`);
    }

    await prisma.class.delete({
      where: { id: classId },
    });

    revalidatePath(getClassesURL());
    return {
      success: true,
      message: `Class with ID ${classId} deleted successfully`,
    };
  } catch (error) {
    console.error("Failed to delete class:", error);
    return { success: false, message: "Failed to delete class" };
  }
};

export const getClassNameByClassId = cache(async (classId: string) => {
  const classData = await prisma.class.findUnique({
    where: {
      id: classId,
    },
    select: {
      name: true,
    },
  });
  if (!classData) return "";
  return classData.name;
});

export const getClassesByUserId = cache(
  async ({ userId }: { userId: string }) => {
    const teacherProfile = await prisma.teacherProfile.findUnique({
      where: {
        userId,
      },
    });
    if (!teacherProfile) {
      throw new Error(`TeacherProfile with userId ${userId} not found`);
    }
    const classes = await prisma.class.findMany({
      where: {
        teacherId: teacherProfile.id,
      },
      include: {
        BotConfig: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return classes;
  },
);

export type ClassesByUserId = UnwrapPromise<
  ReturnType<typeof getClassesByUserId>
>;

export const getClassByClassId = cache(
  async ({ classId }: { classId: string }) => {
    const classInfo = await prisma.class.findUnique({
      where: {
        id: classId,
      },
    });
    if (!classInfo) {
      throw new Error(`Class with classId ${classId} not found`);
    }

    return classInfo;
  },
);

export const archiveClassByClassId = async ({
  classId,
}: {
  classId: string;
}) => {
  try {
    const transaction = await prisma.$transaction(async (prisma) => {
      const isClassExist = await prisma.class.findUnique({
        where: { id: classId },
      });

      if (!isClassExist) {
        throw new Error("class not found");
      }
      await prisma.class.update({
        where: { id: classId },
        data: { isActive: false },
      });

      await prisma.botConfig.updateMany({
        where: { classId },
        data: { isActive: false },
      });

      //TODO: need to update the bot isActive to false
    });
    revalidatePath("/dragon/teacher/");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};

export const unarchiveClassByClassId = async ({
  classId,
}: {
  classId: string;
}) => {
  try {
    const transaction = await prisma.$transaction(async (prisma) => {
      const isClassExist = await prisma.class.findUnique({
        where: { id: classId },
      });

      if (!isClassExist) {
        throw new Error("class not found");
      }

      await prisma.class.update({
        where: { id: classId },
        data: { isActive: true },
      });

      await prisma.botConfig.updateMany({
        where: { classId },
        data: { isActive: true },
      });

      //TODO: need to update the bot isActive to true
    });

    revalidatePath("/dragon/teacher/");

    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};

export const getStudentsByClassId = cache(async (classId: string) => {
  const classData = await prisma.class.findUnique({
    where: { id: classId },
    select: {
      id: true,
      name: true,
      grade: true,
      section: true,
      students: {
        select: {
          grade: true,
          id: true,
          User: {
            select: {
              email: true,
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });
  return {
    students: classData?.students,
    nameOfClass: classData?.name,
    grade: classData?.grade,
    section: classData?.section,
  };
});

export type StudentsByClassId = UnwrapPromise<
  ReturnType<typeof getStudentsByClassId>
>;
