"use server";
import prisma from "@/prisma";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { isAuthorized } from "@/lib/utils";
import { TestQuestions } from "../ai/test-question-parser/model";
import { teacherPreferencesSchema } from "@/lib/schema";

//TODO: Add auth for functions

export const updateTeacherPreferences = async (
  teacherId: string,
  data: z.infer<typeof teacherPreferencesSchema>,
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

export const saveParsedQuestions = async ({
  parsedQuestions,
  botId,
  classId,
}: {
  parsedQuestions: TestQuestions;
  botId: string;
  classId: string;
}) => {
  await isAuthorized({
    userType: "TEACHER",
  });
  try {
    const transaction = await prisma.$transaction(async (prisma) => {
      // const existingParsedQuestionWithBotId =
      //   await prisma.parsedQuestions.findMany({
      //     where: {
      //       botConfigId: botId,
      //     },
      //   });

      // if (existingParsedQuestionWithBotId.length > 0) {
      //   await prisma.parsedQuestions.deleteMany({
      //     where: {
      //       botConfigId: botId,
      //     },
      //   });
      // }

      await prisma.parsedQuestions.createMany({
        data: parsedQuestions.map((ques) => ({
          botConfigId: botId,
          question: ques.question,
          question_number: ques.question_number,
          question_type:
            ques.question_type || "OBJECTIVE_MULTIPLE_CHOICE_SINGLE_ANSWER",
          correct_answer: ques.correct_answer,
          options: ques.options,
          isPossiblyWrong: ques.possiblyWrong.isPossiblyWrong,
          isPossiblyWrongDesc: ques.possiblyWrong.reason,
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
