"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import prisma from "@/prisma";
import { getServerSession } from "next-auth";
import { cache } from "react";
import { db } from "@/lib/routers";

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

const getStudentPreferences = cache(async (studentId: string) => {
  const emptyPreferences = {};
  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { id: studentId },
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

    return preferences;
  } catch (error) {
    console.log("Failed to fetch:", error);
    return null;
  }
});

export type typeGetStudentPreferences = UnwrapPromise<
  ReturnType<typeof getStudentPreferences>
>;

export const getStudentData = async (): Promise<{
  preferences: typeGetStudentPreferences; ///
  studentId: string;
} | null> => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return { preferences: null, studentId: "" };
  }
  const studentId = await db.studentRouter.getStudentId(userId);
  if (!studentId) {
    return { preferences: null, studentId: "" };
  }
  const preferences = await getStudentPreferences(studentId);
  if (!preferences) {
    return { preferences: null, studentId: studentId };
  }
  return { preferences, studentId };
};
