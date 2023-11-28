"use server";
import prisma from "@/prisma";
import { redirect } from "next/navigation";
export async function setTeacherOrgModeToTrue(userId: string) {
  const updateTeacherProfile = await prisma.teacherProfile.upsert({
    where: {
      userId: userId,
    },
    update: {
      orgMode: true,
    },
    create: {
      userId: userId,
      // other required fields for creation
      orgMode: true,
    },
  });
  redirect("/dragon/teacher");

  return updateTeacherProfile;
}
