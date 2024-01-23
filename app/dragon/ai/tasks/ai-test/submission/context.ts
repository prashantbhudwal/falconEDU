"use server";
import { cache } from "react";
import { getChatMessagesByBotChatId } from "@/app/dragon/teacher/class/[classId]/(tasks)/[taskId]/test/queries";
import prisma from "@/prisma";

const getBotChatConfig = cache(async function ({
  botChatId,
}: {
  botChatId: string;
}) {
  const botChat = await prisma.botChat.findUnique({
    where: { id: botChatId },
    select: {
      bot: {
        select: {
          BotConfig: {
            select: {
              id: true,
              name: true,
              type: true,
              isActive: true,
              published: true,
              teacherId: true,
              timeLimit: true,
              canReAttempt: true,
              learningGoals: true,
              teacher: {
                select: {
                  User: {
                    select: {
                      image: true,
                      name: true,
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
  const botConfig = botChat?.bot?.BotConfig;

  if (!botConfig) {
    console.error("BotConfig not found for chatId:", botChatId);
  }
  return botConfig;
});

const getLearningGoals = async (botChatId: string) => {
  try {
    const botConfig = await getBotChatConfig({ botChatId });
    return botConfig?.learningGoals || null;
  } catch (error) {
    console.error(`Error fetching learning goals: ${error}`);
    return null;
  }
};

export const getCheckingContext = async (botChatId: string) => {
  const messages = await getChatMessagesByBotChatId({ botChatId });
  const goals = await getLearningGoals(botChatId);

  if (!goals) {
    throw new Error("Learning goals not found");
  }

  return { goals, messages };
};
