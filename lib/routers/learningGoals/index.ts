"use server";
import prisma from "@/prisma";
import { isAuthorized } from "../../is-authorized";
import { LearningGoals } from "@/app/(schools)/dragon/ai/tasks/ai-test/goals-generator/model";
import { revalidatePath } from "next/cache";

export const saveLearningGoals = async ({
  learningGoals,
  configId,
}: {
  learningGoals: LearningGoals;
  configId: string;
}) => {
  await isAuthorized({
    userType: "TEACHER",
  });

  await prisma.$transaction(async (prisma) => {
    await prisma.learningGoals.createMany({
      data: learningGoals.map((goal) => ({
        botConfigId: configId,
        goal: goal.goal,
        goalNumber: goal.goalNumber,
        cognitiveLevel: goal.cognitiveSkillLevel,
      })),
    });
  });

  const updatedGoals = await prisma.learningGoals.findMany({
    where: {
      botConfigId: configId,
    },
  });
  if (updatedGoals.length === 0) {
    throw new Error("Failed to retrieve updated goals");
  }

  revalidatePath("/dragon/teacher/class");
  return updatedGoals;
};
