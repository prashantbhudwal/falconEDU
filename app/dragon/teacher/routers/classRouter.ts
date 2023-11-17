import { isAuthorized } from "@/lib/is-authorized";
import { getClassesURL } from "@/lib/urls";
import prisma from "@/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const createClassForTeacher = async function ({
  className,
  userId,
}: {
  className: string;
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
      name: className,
      teacherId: teacherProfile.id, // Using the id of TeacherProfile
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
