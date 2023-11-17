"use server";
import prisma from "@/prisma";
import { revalidatePath } from "next/cache";
import { getBotsURL, getClassURL } from "@/lib/urls";
import { botPreferencesSchema, testBotPreferencesSchema } from "../schema";
import { getEditBotURL } from "@/lib/urls";
import * as z from "zod";
import { getClassesURL, getStudentsURL } from "@/lib/urls";
import { isAuthorized } from "@/lib/utils";
import { teacherPreferencesSchema } from "../schema";
import { redirect } from "next/navigation";
import { TestQuestions } from "../ai/test-question-parser/model";

//TODO: Add auth for functions

export const updateTeacherPreferences = async (
  teacherId: string,
  data: z.infer<typeof teacherPreferencesSchema>
) => {
  await isAuthorized({
    userType: "TEACHER",
  });
  try {
    const updatedTeacherProfile = await prisma.teacherProfile.update({
      where: { id: teacherId },
      data: {
        preferences: data,
      },
    });
    revalidatePath("/");
    return { updatedTeacherProfile, success: true };
  } catch (error) {
    console.error("Error updating TeacherProfile:", error);
    return { error: true };
  }
};

export const saveParsedQuestions = async (
  parsedQuestion: TestQuestions,
  botId: string
) => {
  await isAuthorized({
    userType: "TEACHER",
  });
  try {
    const transaction = await prisma.$transaction(async (prisma) => {
      const existingParsedQuestionWithBotId =
        await prisma.parsedQuestions.findMany({
          where: {
            botConfigId: botId,
          },
        });

      if (existingParsedQuestionWithBotId.length > 0) {
        await prisma.parsedQuestions.deleteMany({
          where: {
            botConfigId: botId,
          },
        });
      }

      await prisma.parsedQuestions.createMany({
        data: parsedQuestion.map((ques) => ({
          botConfigId: botId,
          question: ques.question,
          question_number: ques.question_number,
          question_type: "OBJECTIVE_FILL_IN_THE_BLANK_MULTIPLE_ANSWER",
          correct_answer: ques.correct_answer,
        })),
      });
    });
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: err };
  }
};
