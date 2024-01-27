"use server";
import prisma from "@/prisma";
import { GoalAssessmentObjectWithIdArray } from "./model";

export const saveGoalAssessmentByBotChatId = async function ({
  goals,
  botChatId,
}: {
  goals: GoalAssessmentObjectWithIdArray;
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
      await prisma.goalAssessment.createMany({
        data: goals.map((goals) => ({
          botChatId: existingBotChat?.id,
          result: goals.gradeAssigned,
          resultDesc: goals.gradeDescription,
          learningGoalId: goals.id,
          aiRemarks: goals.remarks,
        })),
      });

      // const newGoalAssessment = await prisma.goalAssessment.findMany({
      //   where: {
      //     botChatId: existingBotChat?.id,
      //   },
      // });
      // console.log(newGoalAssessment);
    });
  } catch (err) {
    console.log(err);
    throw new Error("Failed to save results");
  }
};
