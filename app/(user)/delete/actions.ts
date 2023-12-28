"use server";
import prisma from "@/prisma";

export const deleteUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
    },
  });
  const userId = user?.id;
  if (!userId) {
    throw new Error("User not found");
  }
  await prisma.user.delete({
    where: {
      id: userId,
    },
  });
  return true;
};
