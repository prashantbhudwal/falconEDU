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
    const resultArray = parsedTestResults.data.results;
    return resultArray;
  } catch (err) {
    console.log(err);
    throw new Error("Can't generate results");
  }
}
