import prisma from "@/prisma";
import { cache } from "react";

export const getTeacherId = cache(async function (userId: string) {
  console.log("getTeacherId function starts");
  const teacherProfile = await prisma.teacherProfile.findUnique({
    where: { userId },
  });
  console.log("getTeacherId function ends", teacherProfile?.id);
  return teacherProfile?.id;
  
});
