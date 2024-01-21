"use server";
import prisma from "@/prisma";
import { cache } from "react";
import { ChatPromptTemplate } from "langchain/prompts";
import { UnwrapPromise } from "../../../../student/queries";
import { getEngineeredMessagesForTest } from "./template";
import { getQuestionTypeName } from "@/app/dragon/teacher/utils";
export type TestQuestionsByBotChatId = UnwrapPromise<
  ReturnType<typeof getTestQuestionsByBotChatId>
>;
//TODO - this is a big jugaad, need to fix this, either use LangChain or OpenAI Format, don't mix both
function formatToMarkdown(questions: any[]): string {
  if (!questions) {
    return "";
  }
  return questions
    .map((question, index) => {
      let markdown = `### ${index + 1}. ${question.question}\n`;

      if (question.hint) {
        markdown += `**Hint:** ${question.hint}\n`;
      }
      if (question.options && question.options.length > 0) {
        markdown += `**Options:**\n`;
        question.options.forEach((option: string) => {
          markdown += `- ${option}\n`;
        });
      }
      if (question.question_type) {
        const questionTypeName = getQuestionTypeName(question.question_type);
        markdown += `
        ---\n
        Metadata:\n
        Note: Use it to describe the test. Never directly in th Test.
        **Question Type:${questionTypeName}\n
        `;
      }
      return markdown;
    })
    .join("\n");
}

export const getTestQuestionsByBotChatId = cache(async function (
  botChatId: string,
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

export type TestContextByChatId = UnwrapPromise<
  ReturnType<typeof getTestQuestionsByBotChatId>
>;

export async function getEngineeredTestBotMessages(
  questions: TestQuestionsByBotChatId,
) {
  const questionsWitRelevantFields = questions?.map((questionObject) => {
    const { question, question_type, hint, options } = questionObject;

    const result: Partial<typeof questionObject> = { question_type, question };

    if (options && options.length > 0) {
      result.options = options;
    }
    if (hint) {
      result.hint = hint;
    }

    return result;
  });

  const markdownQuestions = formatToMarkdown(
    questionsWitRelevantFields as any[],
  );

  const stringifiedQuestions = JSON.stringify(markdownQuestions ?? "");

  const engineeredMessages = getEngineeredMessagesForTest({
    fullTest: stringifiedQuestions,
  });
  return { engineeredMessages, prompt };
}
