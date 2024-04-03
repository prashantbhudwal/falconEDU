"use server";
import { teacherPreferencesSchema } from "@/lib/schema";
import { isAuthorized } from "@/lib/utils";
import prisma from "@/prisma";
import { revalidatePath } from "next/cache";
import { cache } from "react";
import { z } from "zod";

export const getTeacherPreferences = cache(
  async ({ userId }: { userId: string }) => {
    const emptyPreferences = {};
    try {
      const profile = await prisma.teacherProfile.findUnique({
        where: { userId },
      });

      if (!profile) {
        return null;
      }

      let preferences;
      if (profile && profile.preferences) {
        preferences =
          typeof profile.preferences === "string"
            ? JSON.parse(profile.preferences)
            : profile.preferences;
      } else {
        preferences = emptyPreferences;
      }

      const result = teacherPreferencesSchema.safeParse(preferences);

      if (result.success) {
        return { preferences: result.data, teacherId: profile?.id };
      } else {
        console.error("Validation failed:", result.error);
        return null;
      }
    } catch (error) {
      console.error("Failed to fetch:", error);
      return null;
    }
  },
);

export const updateTeacherPreferences = async (
  teacherId: string,
  data: z.infer<typeof teacherPreferencesSchema>,
) => {
  await isAuthorized({
    userType: "TEACHER",
  });
  try {
    const updatedTeacherProfile = await prisma.teacherProfile.update({
      where: { id: teacherId },
      data: {
        preferences: data,
      },
    });
    revalidatePath("/");
    return { updatedTeacherProfile, success: true };
  } catch (error) {
    console.error("Error updating TeacherProfile:", error);
    return { error: true };
  }
};
