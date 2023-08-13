"use server";
import prisma from "@/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { parseMessages } from "@/utils/messageParsers";

export async function getChats(userId?: string | null) {
  if (!userId) {
    return [];
  }

  try {
    const chats = await prisma.chat.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return chats.map((chat) => ({
      ...chat,
      messages: parseMessages(chat.messages),
    }));
  } catch (error) {
    return [];
  }
}

export async function getChat(id: string, userId?: string) {
  const chat = await prisma.chat.findUnique({
    where: { id },
  });

  if (!chat || (userId && chat.userId !== userId)) {
    return null;
  }

  return {
    ...chat,
    messages: parseMessages(chat.messages),
  };
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return { error: "Unauthorized" };
  }

  const chat = await prisma.chat.findUnique({ where: { id } });

  if (!chat || chat.userId !== session.user.id) {
    return { error: "Unauthorized" };
  }

  await prisma.chat.delete({ where: { id } });

  revalidatePath("/");
  return revalidatePath(path);
}

export async function clearChats() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  await prisma.chat.deleteMany({
    where: { userId: session.user.id },
  });

  revalidatePath("/chubbie");
  return redirect("/chubbie");
}
