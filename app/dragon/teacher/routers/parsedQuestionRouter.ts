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

export const getParsedQuestionsByBotChatId = cache(
  async ({ botChatId }: { botChatId: string }) => {
    try {
      const questions = await prisma.botChatQuestions.findMany({
        where: { botChatId },
        select: {
          isCorrect: true,
          student_answer: true,
          score: true,
          parsedQuestions: {
            select: {
              correct_answer: true,
              options: true,
              question: true,
              question_number: true,
              sample_answer: true,
              question_type: true,
              max_score: true,
              hint: true,
            },
          },
        },
      });

      if (!questions || questions.length === 0) return null;

      const parsedQuestions = questions.map((question) => {
        const { parsedQuestions, ...rest } = question;
        return {
          ...parsedQuestions,
          ...rest,
        };
      });

      //check that question_numbers always exist on parsed questions and then sort parsed questions by question number

      parsedQuestions.sort((a, b) => {
        if (a.question_number && b.question_number) {
          return a.question_number - b.question_number;
        }
        return 0;
      });

      return parsedQuestions;

      return null;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
);

export const getTestResults = cache(
  async ({ botConfigId }: { botConfigId: string }) => {
    try {
      const questions = await prisma.botChatQuestions.findMany({
        where: {
          botChat: {
            bot: {
              botConfigId: botConfigId,
            },
          },
        },
        include: {
          parsedQuestions: true,
          botChat: {
            include: {
              bot: {
                include: {
                  student: {
                    include: {
                      User: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!questions || questions.length === 0) return null;
      //flatten the array
      const questionWithAnswers = questions.map((question) => {
        const { parsedQuestions, botChat, ...rest } = question;
        const { name, email, image } = botChat.bot.student.User;
        const studentId = botChat.bot.student.id;
        const botChatId = botChat.id;
        const hasSubmitted = botChat.bot.isSubmitted;
        return {
          ...question.parsedQuestions,
          ...rest,
          student_name: name,
          student_email: email,
          student_image: image,
          student_id: studentId,
          botChat_id: botChatId,
          hasSubmitted,
        };
      });

      type QuestionWithAnswers = typeof questionWithAnswers;
      type GroupedResults = {
        [key: string]: QuestionWithAnswers;
      };

      const groupBy = (
        array: QuestionWithAnswers,
        key: keyof QuestionWithAnswers[number]
      ) => {
        return array.reduce((result, currentItem) => {
          const keyValue = currentItem[key];
          // Convert keyValue to a string if it's not already
          const keyAsString = String(keyValue);

          (result[keyAsString] = result[keyAsString] || []).push(currentItem);
          return result;
        }, {} as GroupedResults);
      };

      type BotChatScore = {
        correctAnswers: number;
        totalQuestions: number;
      };

      type BotChatScores = {
        [botChatId: string]: BotChatScore;
      };
      const calculateBotChatScores = (
        botChats: GroupedResults
      ): BotChatScores => {
        const scores: BotChatScores = {};

        Object.entries(botChats).forEach(([botChatId, questions]) => {
          const correctAnswers = questions.filter(
            (question) => question.isCorrect
          ).length; // Assuming 'isCorrect' field exists
          scores[botChatId] = {
            correctAnswers,
            totalQuestions: questions.length,
          };
        });
        return scores;
      };

      // Operations
      const studentWiseResults = groupBy(questionWithAnswers, "student_id");
      const botChatWiseResults = groupBy(questionWithAnswers, "botChat_id");

      const botChatScores = calculateBotChatScores(botChatWiseResults);

      console.log("studentWiseResults", studentWiseResults);
      console.log("botChatWiseResults", botChatWiseResults);
      console.log("botChatScores", botChatScores);

      return {
        allQuestions: questionWithAnswers,
        studentWiseResults,
        botChatWiseResults,
        botChatScores,
      };
    } catch (err) {
      console.log(err);
      return null;
    }
  }
);
