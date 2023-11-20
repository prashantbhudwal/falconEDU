import prisma from "@/prisma";
import { cache } from "react";
import { ChatPromptTemplate } from "langchain/prompts";
import { UnwrapPromise } from "../../../../queries";
import { systemTemplate } from "./test-template";
export type TestQuestionsByBotChatId = UnwrapPromise<
  ReturnType<typeof getTestQuestionsByBotChatId>
>;

export const getTestQuestionsByBotChatId = cache(async function (
  botChatId: string
) {
  const context = await prisma.botChat.findUnique({
    where: { id: botChatId },
    select: {
      bot: {
        select: {
          BotConfig: {
            select: {
              preferences: true,
              parsedQuestions: true,
            },
          },
        },
      },
    },
  });

  if (!context) {
    console.error("context not found for chatId:", botChatId);
  }

  let testQuestions = context?.bot?.BotConfig?.parsedQuestions;

  return testQuestions;
});

export async function getEngineeredTestBotMessages(
  questions: TestQuestionsByBotChatId
) {
  const questionsWitRelevantFields = questions?.map((questionObject) => {
    const {
      question,
      correct_answer,
      sample_answer,
      question_type,
      hint,
      options,
    } = questionObject;
    return {
      question,
      correct_answer,
      sample_answer,
      question_type,
      hint,
      options,
    };
  });

  const stringifiedQuestions = JSON.stringify(questionsWitRelevantFields ?? "");

  const prompt = ChatPromptTemplate.fromMessages([["system", systemTemplate]]);

  const engineeredMessages = await prompt.formatMessages({
    fullTest: stringifiedQuestions,
  });
  return { engineeredMessages, prompt };
}
