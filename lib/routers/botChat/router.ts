"use server";
import prisma from "@/prisma";
import { cache } from "react";
import { type Message } from "ai/react";

export const getBotChatWithStudentByBotChatId = cache(async function ({
  botChatId,
}: {
  botChatId: string;
}) {
  const botChat = await prisma.botChat.findUnique({
    where: { id: botChatId },
    select: {
      isSubmitted: true,
      bot: {
        select: {
          id: true,
          isSubmitted: true,
          isChecked: true,
          isActive: true,
          student: {
            select: {
              User: {
                select: {
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return botChat || null;
});

export const getChatMessagesByBotChatId = cache(async function ({
  botChatId,
}: {
  botChatId: string;
}): Promise<{ messages: Message[]; id: string; userImage: string }> {
  const chat = await prisma.botChat.findFirst({
    where: {
      id: botChatId,
    },
    select: {
      messages: true,
      id: true,
      bot: {
        select: {
          student: {
            select: {
              User: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      },
    },
  });
  const image = chat?.bot?.student?.User?.image;

  if (!chat || !chat.messages) {
    throw new Error(`Default chat not found for studentBotId ${botChatId}`);
  }

  if (typeof chat.messages === "string") {
    const parsedMessages = JSON.parse(chat.messages);
    if (!Array.isArray(parsedMessages)) {
      throw new Error("Parsed messages are not an array");
    }
    return {
      messages: parsedMessages,
      id: chat?.id,
      userImage: image ?? "",
    };
  } else {
    return { messages: [], id: chat?.id, userImage: "" };
  }
});

