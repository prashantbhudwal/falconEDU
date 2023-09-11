"use server";
import prisma from "@/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { botData, botDataArray } from "../../test-data";

export async function getBot(id: string, userId?: string) {
  //   const chat = await prisma.chat.findUnique({
  //     where: { id },
  //   });

  //   if (!chat || (userId && chat.userId !== userId)) {
  //     return null;
  //   }

  //   return {
  //     ...chat,
  //     messages: parseMessages(chat.messages),
  //   };
  return botData;
}

export async function getBots(userId?: string | null) {
  if (!userId) {
    return [];
  }

  //   try {
  //     const chats = await prisma.chat.findMany({
  //       where: { userId },
  //       orderBy: { createdAt: "desc" },
  //     });

  //     return chats.map((chat) => ({
  //       ...chat,
  //       messages: parseMessages(chat.messages),
  //     }));
  //   } catch (error) {
  //     return [];
  //   }
  return botDataArray;
}

export async function removeBot({ id, path }: { id: string; path: string }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return { error: "Unauthorized" };
  }

  //   const chat = await prisma.chat.findUnique({ where: { id } });

  //   if (!chat || chat.userId !== session.user.id) {
  //     return { error: "Unauthorized" };
  //   }

  //   await prisma.chat.delete({ where: { id } });

  revalidatePath("/dragon");
  return revalidatePath(path);
}
