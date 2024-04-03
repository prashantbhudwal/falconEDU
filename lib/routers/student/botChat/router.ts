"use server";
import { cache } from "react";
import prisma from "@/prisma";

export const getChatsByBotId = cache(async function (botId: string) {
  const chats = await prisma.botChat.findMany({
    where: {
      botId,
    },
    include: {
      bot: {
        include: {
          BotConfig: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return chats;
});

export const getBotChatByChatId = cache(async function (chatId: string) {
  const botChat = await prisma.botChat.findUnique({
    where: { id: chatId },
    select: {
      messages: true,
      isRead: true,
      id: true,
      isSubmitted: true,
      bot: {
        select: {
          BotConfig: {
            select: {
              avatar: true,
              teacher: {
                select: {
                  User: {
                    select: {
                      image: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  let botImage = botChat?.bot?.BotConfig?.teacher?.User?.image;
  if (!botImage) {
    botImage = "/chubbi.png";
  }

  if (!botChat || !botChat.messages) {
    console.error("BotChat not found for chatId:", chatId);
    return null;
  }
  let messagesArray = [];
  if (typeof botChat.messages === "string") {
    messagesArray = JSON.parse(botChat.messages);
  }
  return {
    botImage,
    messages: messagesArray,
    isRead: botChat.isRead,
    botChatId: botChat.id,
    isSubmitted: botChat.isSubmitted,
    avatar: botChat.bot?.BotConfig?.avatar,
  };
});

export const getDefaultChatReadStatus = async function (botId: string) {
  const readStatus = await prisma.botChat.findFirst({
    where: {
      botId: botId,
      isDefault: true,
    },
    select: {
      id: true,
      isRead: true,
    },
  });
  if (!readStatus) throw new Error("No default chat found");
  return { isRead: readStatus?.isRead };
};
