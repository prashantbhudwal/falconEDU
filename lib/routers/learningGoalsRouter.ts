"use server";
import prisma from "@/prisma";
import { isAuthorized } from "../is-authorized";
import { LearningGoals } from "@/app/dragon/ai/tasks/ai-test/goals-generator/model";
import { revalidatePath } from "next/cache";

export const createLearningGoals = async ({
  learningGoals,
  configId,
}: {
  learningGoals: LearningGoals;
  configId: string;
}) => {
  await isAuthorized({
    userType: "TEACHER",
  });
  try {
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
    revalidatePath("/dragon/teacher/class");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: err };
  }
};
