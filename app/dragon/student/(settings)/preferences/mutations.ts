"use server";
import { StudentPreferencesSchema } from "@/app/dragon/schema";
import { z } from "zod";
import { FormSchema } from "./preferences-form";
import { isAuthorized } from "@/lib/is-authorized";
import prisma from "@/prisma";
import { revalidatePath } from "next/cache";

export const updateStudentPreferences = async ({
  studentId,
  data,
}: {
  studentId: string;
  data: z.infer<typeof FormSchema>;
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
