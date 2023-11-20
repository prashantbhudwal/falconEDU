"use server";
import prisma from "@/prisma";
import { notFound } from "next/navigation";

export async function teacherHasOrgMode({ userId }: { userId: string }) {
  const teacherProfile = await prisma.teacherProfile.findUnique({
    where: {
      userId: userId,
    },
    select: {
      orgMode: true,
    },
  });
  if (!teacherProfile) return notFound();
  return teacherProfile.orgMode;
}
