"use server";
import { ChatPromptTemplate } from "langchain/prompts";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import {
  baseModel,
  testQuestionDataExtractionModel,
  testQuestionObjectSchema,
} from "./model";
import { systemTemplateForParsing } from "./template";

export async function getTestQuestions(test: string) {
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
    const questions = parsedTestResults.data.results;
    const hasQuestions = parsedTestResults.data.questionsInTest;
    const hasAnswers = parsedTestResults.data.answersInTest;

    return {questions, hasQuestions, hasAnswers};
  } catch (err) {
    console.log(err);
    throw new Error("Can't generate results");
  }
}
