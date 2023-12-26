"use server";
import * as z from "zod";
import { revalidatePath } from "next/cache";
import prisma from "@/prisma";
import { cache } from "react";
import { UnwrapPromise } from "../../student/queries";
import { TaskType } from "@/types/dragon";
import { getTaskProperties } from "../utils";

export const createBotChat = async ({ botId }: { botId: string }) => {
  const botChat = await prisma.botChat.create({
    data: {
      botId,
      messages: [],
    },
  });
  revalidatePath(`/dragon/student/`);
  return botChat;
};
