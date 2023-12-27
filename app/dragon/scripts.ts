import prisma from "@/prisma";

export const makeAllBotChatIsSubmitted = async () => {
  const x = await prisma.bot.findMany({
    where: { isSubmitted: true },
    select: {
      BotChat: true,
    },
  });

  x.map(async (item) => {
    const defaultChat = item.BotChat.filter((chat) => chat.isDefault);

    const y = await prisma.botChat.update({
      where: { id: defaultChat[0].id },
      data: {
        isSubmitted: true,
      },
    });

    console.log(y.isSubmitted);
  });
};
