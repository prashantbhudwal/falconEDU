"use server";
import prisma from "@/prisma";

export async function getUserData(email: string) {
  //write code to fetch user data from database using prisma
  let user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  return user;
}

export const createWorksheet = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new Error("Teacher not found");
  }

  const teacherId = user.id;

  return teacherId;
};
