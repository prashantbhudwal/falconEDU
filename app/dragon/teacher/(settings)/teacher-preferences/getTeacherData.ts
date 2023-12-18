"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { teacherPreferencesSchema } from "@/app/dragon/schema";
import { getTeacherId } from "@/app/dragon/teacher/queries";
import prisma from "@/prisma";
import { getServerSession } from "next-auth";
import { cache } from "react";

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

const getTeacherPreferences = cache(async (teacherId: string) => {
  const emptyPreferences = {};
  try {
    const profile = await prisma.teacherProfile.findUnique({
      where: { id: teacherId },
    });

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
      return result.data;
    } else {
      console.error("Validation failed:", result.error);
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch:", error);
    return null;
  }
});
export type typeGetTeacherPreferences = UnwrapPromise<
  ReturnType<typeof getTeacherPreferences>
>;

export const getTeacherData = async (): Promise<{
  preferences: typeGetTeacherPreferences;
  teacherId: string;
} | null> => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return { preferences: null, teacherId: "" };
  }
  const teacherId = await getTeacherId(userId);
  if (!teacherId) {
    return { preferences: null, teacherId: "" };
  }
  const preferences = await getTeacherPreferences(teacherId);
  // const preferences = await getTeacherPreferences("clp3tmiw30004jp081fzmemb7");
  if (!preferences) {
    return { preferences: null, teacherId: "" };
  }
  return { preferences, teacherId };
};
