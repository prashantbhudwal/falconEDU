"use server";
import { botPreferences } from "@/app/dragon/test-data";

export async function getInitialValues(id: string, userId?: string) {
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
  return botPreferences[0];
}
