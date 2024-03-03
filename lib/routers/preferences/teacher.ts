"use server";
import { teacherPreferencesSchema } from "@/lib/schema";
import prisma from "@/prisma";
import { cache } from "react";

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
