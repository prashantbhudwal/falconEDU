"use server";
import prisma from "@/prisma";
import { notFound } from "next/navigation";
import { cache } from "react";

export const teacherHasOrgMode = cache(async ({ userId }: { userId: string }) => {
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
});
