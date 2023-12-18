"use server";
import { z } from "zod";
import { StudentPreferenceSchema } from "@/app/dragon/schema";
import { isAuthorized } from "@/lib/is-authorized";
import prisma from "@/prisma";
import { revalidatePath } from "next/cache";

export const updateStudentPreferences = async ({
  studentId,
  data,
}: {
  studentId: string;
  data: z.infer<typeof StudentPreferenceSchema>;
}) => {
  try {
    const updatedStudentProfile = await prisma.studentProfile.update({
      where: { id: studentId },
      data: {
        preferences: data,
      },
    });

    console.log(updatedStudentProfile);
    revalidatePath("/");
    return { updatedStudentProfile, success: true };
  } catch (error) {
    console.log("Error updating Student Profile:", error);
    return { updatedStudentProfile: null, success: false };
  }
};
