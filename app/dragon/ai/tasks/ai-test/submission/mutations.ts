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
        })),
      });
    });
  } catch (err) {
    console.log(err);
    throw new Error("Failed to save results");
  }
};
