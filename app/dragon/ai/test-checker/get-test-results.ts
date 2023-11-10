"use server";
import { ChatPromptTemplate } from "langchain/prompts";
import { cache } from "react";
import prisma from "@/prisma";
import { getDefaultChatMessagesByStudentBotId } from "../../teacher/class/[classId]/tests/queries";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import {
  TestResultsAnswerSchema,
  testCheckingModel,
  testResultsObjectSchema,
} from "./model";
import { systemTemplateForChecking } from "./templates";
import { getBotByBotId } from "../../student/queries";
import { z } from "zod";

const getTest = cache(async function (testBotId: string) {
  const bot = await getBotByBotId(testBotId);

  if (bot) {
    const questions = await prisma.botConfig.findUnique({
      where: { id: bot?.BotConfig.id },
      select: {
        parsedQuestions: true,
      },
    });

    if (questions && questions.parsedQuestions.length > 0) {
      return { testQuestions: questions?.parsedQuestions };
    }

    return { testQuestions: null };
  }

  return { testQuestions: null };
});

export async function getTestResults(testBotId: string) {
  const { messages, id: botChatId } =
    await getDefaultChatMessagesByStudentBotId(testBotId);
  const jsonOutputParser = new JsonOutputFunctionsParser();

  const { testQuestions } = (await getTest(testBotId)) ?? {
    testQuestions: null,
  };

  if (!testQuestions) {
    console.error("Test not found");
  }
  const promptForTestChecking = ChatPromptTemplate.fromMessages([
    ["system", systemTemplateForChecking],
  ]);

  try {
    const testCheckingChain = promptForTestChecking
      .pipe(testCheckingModel)
      .pipe(jsonOutputParser);

    const testResults = (await testCheckingChain.invoke({
      test: testQuestions,
      answers: JSON.stringify(messages),
    })) as z.infer<typeof testResultsObjectSchema>;

    const finalTestResults = testQuestions?.map((question) => {
      return {
        ...testResults?.results[question.question_number - 1],
        id: question.id,
      };
    });

    const testResultObjectSchemaWithId = z.array(
      TestResultsAnswerSchema.extend({
        id: z.string(),
      })
    );

    const extendedTestResultSchema = z.object({
      results: testResultObjectSchemaWithId,
    });

    const parsedTestResults = extendedTestResultSchema.safeParse({
      results: finalTestResults,
    });

    if (!parsedTestResults.success) {
      console.log(parsedTestResults);
      throw new Error("Parsing failed");
    }
    const resultArray = parsedTestResults.data.results;

    return resultArray;
  } catch (err) {
    console.log(err);
    throw new Error("Can't generate results");
  }
}
