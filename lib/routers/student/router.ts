"use server";

import prisma from "@/prisma";
import { cache } from "react";

export const getStudentId = cache(async function (userId: string) {
  const studentProfile = await prisma.studentProfile.findFirst({
    where: { userId },
    select: { id: true },
  });

  return studentProfile?.id;
});
