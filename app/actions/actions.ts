"use server";
import prisma from "@/prisma";

export async function getUserData(email: string) {
  //write code to fetch user data from database using prisma
  let user = await prisma.teacher.findUnique({
    where: {
      email: email,
    },
  });
  return user;
}

const saveWorksheet = async () => {
  //write code to save worksheet to database using prisma
  
};
