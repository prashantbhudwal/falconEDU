"use server";

import prisma from "@/prisma";
import { Chat } from "./types";
import { authOptions } from "@/app/(schools)/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";

export const saveChat = async (chat: Chat) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string;
  const { id, ...data } = chat;
  const stringifiedMessages = JSON.stringify(data.messages);

  const payload = {
    path: `/chat/${id}`,
    title: data.messages[0].content.substring(0, 100),
    messages: stringifiedMessages,
  };
  try {
    await prisma.chat.upsert({
      where: { id },
      update: {
        messages: stringifiedMessages,
      },
      create: {
        id,
        userId,
        ...payload,
      },
    });
  } catch (error) {
    console.error("Upsert Error:", error);
  }
};
