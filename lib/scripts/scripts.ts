"use server";
import prisma from "@/prisma";

export const makeAllBotChatIsSubmitted = async () => {
  const x = await prisma.bot.findMany({
    where: { isSubmitted: true },
    select: {
      BotChat: true,
    },
  });

  x.map(async (item) => {
    const defaultChat = item.BotChat.find((chat) => chat.isDefault);
    const y = await prisma.botChat.update({
      where: { id: defaultChat?.id },
      data: {
        isSubmitted: true,
      },
    });
  });
};
