"use server";
import prisma from "@/prisma";
import { cache } from "react";
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export const updateParsedQuestion = async ({
  parseQuestionId,
  data,
}: {
  parseQuestionId: string;
  data: NonNullable<typeGetParsedQuestionByBotConfigId>[number];
}) => {
  try {
    const response = await prisma.parsedQuestions.update({
      where: { id: parseQuestionId },
      data: {
        correct_answer: data.correct_answer,
        question: data.question,
        options: data.options,
      },
    });
    if (response) {
      return { success: true, response };
    }
    return { success: false, response: null };
  } catch (err) {
    console.log(err);
    return { success: false, response: null };
  }
};

export const getParsedQuestionByBotConfigId = cache(
  async ({ botConfigId }: { botConfigId: string }) => {
    try {
      const questions = await prisma.botConfig.findUnique({
        where: { id: botConfigId },
        select: {
          parsedQuestions: {
            orderBy: {
              question_number: "asc",
            },
          },
        },
      });

      if (questions && questions.parsedQuestions.length > 0) {
        return questions.parsedQuestions;
      }

      return null;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
);

export type typeGetParsedQuestionByBotConfigId = UnwrapPromise<
  ReturnType<typeof getParsedQuestionByBotConfigId>
>;
