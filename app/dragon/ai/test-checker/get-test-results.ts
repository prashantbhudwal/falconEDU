"use server";
import { testBotPreferencesSchema } from "@/app/dragon/schema";
import { isEmptyObject } from "@/app/dragon/student/api/chat/queries";
import { ChatPromptTemplate } from "langchain/prompts";
import { cache } from "react";
import prisma from "@/prisma";
import { getDefaultChatMessagesByStudentBotId } from "../../teacher/class/[classId]/tests/queries";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import { testDataExtractionModel } from "./model";
import { baseModel } from "./model";
import { systemTemplateForChecking, systemTemplateForJson } from "./templates";
import { StringOutputParser } from "langchain/schema/output_parser";
import { testResultsObjectSchema } from "./model";

const getTest = cache(async function (chatId: string) {
  const context = await prisma.botChat.findUnique({
    where: { id: chatId },
    select: {
      bot: {
        select: {
          BotConfig: {
            select: {
              preferences: true,
            },
          },
        },
      },
    },
  });

  if (!context) {
    console.error("context not found for chatId:", chatId);
  }

  let botPreferences = context?.bot?.BotConfig?.preferences;

  // Add default values for preferences and then parse them when empty
  const parsedBotPreferences = isEmptyObject(botPreferences)
    ? { success: true, data: { fullTest: "" } }
    : testBotPreferencesSchema.safeParse(botPreferences);

  if (parsedBotPreferences.success) {
    return {
      test: parsedBotPreferences.data.fullTest,
    };
  } else {
    console.error("Validation failed:");
    return null;
  }
});

export async function getTestResults(testBotId: string) {
  const jsonOutputParser = new JsonOutputFunctionsParser();
  const stringOutputParser = new StringOutputParser();
  const { messages, id: botChatId } =
    await getDefaultChatMessagesByStudentBotId(testBotId);

  const { test } = (await getTest(botChatId)) ?? { test: null };

  if (!test) {
    console.error("Test not found");
  }
  const promptForTestChecking = ChatPromptTemplate.fromMessages([
    ["system", systemTemplateForChecking],
  ]);

  const promptForJsonExtraction = ChatPromptTemplate.fromMessages([
    ["system", systemTemplateForJson],
    ["user", "{testResults}"],
  ]);

  try {
    const testCheckingChain = promptForTestChecking
      .pipe(baseModel)
      .pipe(stringOutputParser);

    const testResults = await testCheckingChain.invoke({
      test: test,
      answers: JSON.stringify(messages),
    });

    const extractionChain = promptForJsonExtraction
      .pipe(testDataExtractionModel)
      .pipe(jsonOutputParser);

    const testResultsJson = await extractionChain.invoke({
      testResults: testResults,
    });

    const parsedTestResults =
      testResultsObjectSchema.safeParse(testResultsJson);
    if (!parsedTestResults.success) {
      throw new Error("Parsing failed");
    }
    const resultArray = parsedTestResults.data.results;

    return resultArray;
  } catch (err) {
    throw new Error("Can't generate results");
  }
}
