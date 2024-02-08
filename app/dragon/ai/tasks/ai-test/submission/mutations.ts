"use server";
import prisma from "@/prisma";
import { GoalAssessmentObjectWithIdArray } from "./checking-model";

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
