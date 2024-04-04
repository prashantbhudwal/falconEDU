"use server";
import { StudentPreferenceSchema } from "@/lib/schema";
import prisma from "@/prisma";
import { revalidatePath } from "next/cache";
import { cache } from "react";
import { z } from "zod";

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
