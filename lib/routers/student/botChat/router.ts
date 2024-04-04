"use server";
import { cache } from "react";
import prisma from "@/prisma";
import { revalidatePath } from "next/cache";
import { FinalTestResults } from "./types";
import type { Message } from "ai";
import { GoalAssessmentObjectWithIdArray } from "@/app/dragon/ai/tasks/ai-test/submission/checking-model";

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

export const submitBotChat = async function ({
  botChatId,
}: {
  botChatId: string;
}) {
  try {
    await prisma.botChat.update({
      where: { id: botChatId },
      data: {
        isSubmitted: true,
      },
    });
    revalidatePath("/dragon/student");
    return { success: true };
  } catch (error) {
    console.log("Error updating Bot:", error);
    throw new Error("Failed to update Bot");
  }
};

export const saveTestResultsByBotChatId = async function ({
  testResults,
  botChatId,
}: {
  testResults: FinalTestResults;
  botChatId: string;
}) {
  try {
    const transaction = await prisma.$transaction(async (prisma) => {
      const existingBotChat = await prisma.botChat.findUnique({
        where: {
          id: botChatId,
        },
      });
      if (!existingBotChat) {
        console.error("Bot not found");
        return null;
      }
      const response = await prisma.botChatQuestions.createMany({
        data: testResults.map((ques) => ({
          botChatId: existingBotChat?.id,
          isCorrect: ques.isCorrect,
          student_answer: ques.student_answer,
          parsedQuestionsId: ques.id,
        })),
      });
    });
  } catch (err) {
    console.log(err);
    throw new Error("Failed to save results");
  }
};

export const setIsReadToTrue = async function (botChatId: string) {
  const botChat = await prisma.botChat.findFirst({
    where: {
      id: botChatId,
    },
  });

  if (botChat?.isRead) {
    return;
  }

  try {
    await prisma.botChat.update({
      where: {
        id: botChatId,
      },
      data: {
        isRead: true,
      },
    });
    revalidatePath("/");
  } catch (error) {
    console.error("Error updating Chat Status.", error);
    throw new Error("Failed to update Chat Status");
  }
};

export const saveBotChatToDatabase = async function (
  botChatId: string,
  completion: any,
  history: Message[],
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

export const saveGoalAssessmentByBotChatId = async function ({
  goals,
  botChatId,
}: {
  goals: GoalAssessmentObjectWithIdArray;
  botChatId: string;
}) {
  const existingBotChat = await prisma.botChat.findUnique({
    where: {
      id: botChatId,
    },
  });
  if (!existingBotChat) {
    throw new Error("Bot not found");
  }
  await prisma.$transaction(async (prisma) => {
    await prisma.goalAssessment.createMany({
      data: goals.map((goals) => ({
        botChatId: existingBotChat?.id,
        result: goals.gradeAssigned,
        resultDesc: goals.gradeDescription,
        learningGoalId: goals.id,
        aiRemarks: goals.remarks,
      })),
    });
  });
  const newGoalAssessment = await prisma.goalAssessment.findMany({
    where: {
      botChatId: existingBotChat?.id,
    },
  });
  if (newGoalAssessment.length !== goals.length) {
    throw new Error("Failed to save results");
  }
};

export const saveFeedbackByBotChatId = async function ({
  feedback,
  botChatId,
}: {
  feedback: any;
  botChatId: string;
}) {
  const existingBotChat = await prisma.botChat.update({
    where: {
      id: botChatId,
    },
    data: {
      feedbackToStudent: feedback,
    },
  });
  if (!existingBotChat) {
    throw new Error("Bot not found");
  }
};
