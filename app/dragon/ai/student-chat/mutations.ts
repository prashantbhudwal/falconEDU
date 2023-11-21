"use server";
import prisma from "@/prisma";
import { cache } from "react";
import { revalidatePath } from "next/cache";
import { getBotsURL } from "@/lib/urls";
import { getEditBotURL } from "@/lib/urls";
import * as z from "zod";
import { getClassesURL, getStudentsURL } from "@/lib/urls";
import type { Message } from "ai";

export const saveBotChatToDatabase = async function (
  botChatId: string,
  completion: any,
  history: Message[]
) {
  try {
    const updatedBotChat = await prisma.botChat.update({
      where: { id: botChatId },
      data: {
        messages: JSON.stringify([
          ...history,
          {
            content: completion,
            role: "assistant",
          },
        ]),
      },
    });
    return updatedBotChat;
  } catch (error) {
    console.error("Error updating BotChat:", error);
    throw new Error("Failed to update BotChat");
  }
};
