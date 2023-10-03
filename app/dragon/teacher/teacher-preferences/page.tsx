import TeacherPreferencesForm from "./teacher-preferences-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getTeacherId } from "../queries";
import { cache } from "react";
import prisma from "@/prisma";
import { teacherPreferencesSchema } from "../../schema";
type TeacherPreferencesPageProps = {
  params: {
    classId: string;
  };
};

const getTeacherPreferences = cache(async (teacherId: string) => {
  const emptyPreferences = {};
  try {
    const profile = await prisma.teacherProfile.findUnique({
      where: { id: teacherId },
    });

    // console.log("Fetched successfully.")

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

export default async function TeacherPreferencesPage({
  params,
}: TeacherPreferencesPageProps) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return null;
  }
  const teacherId = await getTeacherId(userId);
  if (!teacherId) {
    return null;
  }
  const preferences = await getTeacherPreferences(teacherId);
  if (!preferences) {
    return null;
  }

  return (
    <>
      <TeacherPreferencesForm
        initialValues={preferences}
        teacherId={teacherId}
      />
    </>
  );
}
