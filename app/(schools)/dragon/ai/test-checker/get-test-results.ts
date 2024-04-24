import { ChatPromptTemplate } from "langchain/prompts";
import { systemTemplateForChecking } from "./templates";
import { TestResultsAnswerSchema, testResultsObjectSchema } from "./tool";
import { testCheckingModel } from "./model";

import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import { z } from "zod";

export const getTestResultsFromOpenAI = async function ({
  testQuestions,
  messages,
}: {
  testQuestions: any;
  messages: any;
}) {
  const jsonOutputParser = new JsonOutputFunctionsParser();

  const promptForTestChecking = ChatPromptTemplate.fromMessages([
    ["system", systemTemplateForChecking],
  ]);
  const testCheckingChain = promptForTestChecking
    .pipe(testCheckingModel)
    .pipe(jsonOutputParser);

  const testResults = await testCheckingChain.invoke({
    test: JSON.stringify(testQuestions),
    answers: JSON.stringify(messages),
  });

  const parsedResults = testResultsObjectSchema.safeParse(testResults);

  if (!parsedResults.success) {
    console.error("Error parsing test results:", parsedResults.error);
    throw new Error("Error parsing test results");
  }

  return parsedResults.data;
};
