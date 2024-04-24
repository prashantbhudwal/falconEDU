"use server";
import { TestQuestions } from "@/app/(schools)/dragon/ai/test-question-parser/model";
import { isAuthorized } from "@/lib/utils";
import prisma from "@/prisma";
import { revalidatePath } from "next/cache";
import { cache } from "react";

export const getTestResultsByBotChatId = cache(
  async ({ botChatId }: { botChatId: string }) => {
    try {
      const response = await prisma.botChat.findUnique({
        where: {
          id: botChatId,
        },
        select: {
          BotChatQuestions: {
            select: {
              student_answer: true,
              isCorrect: true,
              parsedQuestionsId: true,
            },
          },
        },
      });
      if (response?.BotChatQuestions.length) {
        return response.BotChatQuestions;
      }
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  },
);

export const getTotalQuestionByParsedQuestionId = cache(
  async (parsedQuestionId: string) => {
    try {
      const response = await prisma.botChatQuestions.findMany({
        where: {
          parsedQuestionsId: parsedQuestionId,
        },
      });
      return response;
    } catch (err) {
      console.error(err);
    }
  },
);

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
