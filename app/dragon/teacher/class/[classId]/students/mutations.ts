"use server";
import { isAuthorized } from "@/lib/utils";
import prisma from "@/prisma";
import { revalidatePath } from "next/cache";
import { getStudentsURL } from "@/lib/urls";

//TODO create bots for student who is added to the class

export const addStudentToClass = async (email: string, classId: string) => {
  await isAuthorized({
    userType: "TEACHER",
  });
  try {
    // Check if user exists and is a student
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, userType: true },
    });

    if (!user || user.userType !== "STUDENT") {
      return { notFound: true };
    }

    // Check if student profile exists, create if not
    //TODO Fix this in the db to avoid this hack
    let studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: user.id },
    });

    if (!studentProfile) {
      studentProfile = await prisma.studentProfile.create({
        data: {
          userId: user.id,
          grade: "",
        },
      });
    }

    // Add student to class
    await prisma.class.update({
      where: { id: classId },
      data: {
        students: {
          connect: { id: studentProfile.id },
        },
      },
    });
    revalidatePath(getStudentsURL(classId));
    return { success: true };
  } catch (error) {
    console.error("Error adding student to class:", error);
    return { error: true };
  }
};

export const removeStudentFromClass = async (
  studentId: string,
  classId: string
) => {
  await isAuthorized({
    userType: "TEACHER",
  });
  try {
    // Remove student from class
    await prisma.class.update({
      where: { id: classId },
      data: {
        students: {
          disconnect: { id: studentId },
        },
      },
    });
    revalidatePath(getStudentsURL(classId));
    return { success: true };
  } catch (error) {
    console.error("Error removing student from class:", error);
    return { error: true };
  }
};
