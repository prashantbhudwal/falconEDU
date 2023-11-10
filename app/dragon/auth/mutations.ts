"use server";
import prisma from "@/prisma";
import { redirect } from "next/navigation";
export async function setTeacherOrgModeToTrue(userId: string) {
  const updateTeacherProfile = await prisma.teacherProfile.update({
    where: {
      userId: userId,
    },
    data: {
      orgMode: true,
    },
  });
  redirect("/dragon/teacher");

  return updateTeacherProfile;
}
