"use server";
import { ChatPromptTemplate } from "langchain/prompts";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import {
  baseModel,
  testQuestionDataExtractionModel,
  testQuestionObjectSchema,
} from "./model";
import { systemTemplateForParsing } from "./template";

export async function parseTestQuestions(test: string) {
  const jsonOutputParser = new JsonOutputFunctionsParser();
  //   const stringOutputParser = new StringOutputParser();

  const promptForJsonExtraction = ChatPromptTemplate.fromMessages([
    ["system", systemTemplateForParsing],
  ]);

  try {
    const extractionChain = promptForJsonExtraction
      .pipe(testQuestionDataExtractionModel)
      .pipe(jsonOutputParser);

    const testResultsJson = await extractionChain.invoke({
      test: test,
    });

    const parsedTestResults =
      testQuestionObjectSchema.safeParse(testResultsJson);
    if (!parsedTestResults.success) {
      throw new Error("Parsing failed");
    }
    const parsedQuestions = parsedTestResults.data.results;
    const hasQuestions = parsedTestResults.data.questionsInTest;
    const hasAnswers = parsedTestResults.data.answersInTest;

    return {
      parsedQuestions,
      hasQuestions,
      hasAnswers,
      error: false,
      message: "Parsing Successful",
    };
  } catch (err) {
    console.error(err);
    return {
      parsedQuestions: null,
      hasQuestions: null,
      hasAnswers: null,
      error: true,
      message: "Can't generate questions for test",
    };
    throw new Error("Can't generate results");
  }
}
