"use server";
import { ChatPromptTemplate } from "langchain/prompts";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import { extractTestQuestionsAsJson, testQuestionObjectSchema } from "./model";
import { systemTemplateForParsing } from "./template";
import { ChatOpenAI } from "langchain/chat_models/openai";
import pRetry from "p-retry";
import { z } from "zod";
import { OPENAI_MODEL } from "../config";
import { UnwrapPromise } from "@/lib/routers/helpers";

type TestQuestionObjectType = z.infer<typeof testQuestionObjectSchema>;

const MODEL_OPTIONS_RETRY = {
  name: OPENAI_MODEL.GPT4,
  temperatures: [0.0, 0.5, 1.0],
};

const tryExtraction = async function ({
  attemptNumber,
  test,
}: {
  attemptNumber: number;
  test: string;
}): Promise<TestQuestionObjectType> {
  const jsonOutputParser = new JsonOutputFunctionsParser();

  const temperature =
    MODEL_OPTIONS_RETRY.temperatures[
      Math.min(attemptNumber - 1, MODEL_OPTIONS_RETRY.temperatures.length - 1)
    ];

  const baseModel = new ChatOpenAI({
    modelName: MODEL_OPTIONS_RETRY.name,
    temperature,
  });

  const testQuestionDataExtractionModel = baseModel.bind({
    functions: [extractTestQuestionsAsJson],
    function_call: { name: "extractTestQuestionsAsJson" },
  });

  const promptForJsonExtraction = ChatPromptTemplate.fromMessages([
    ["system", systemTemplateForParsing],
  ]);

  const extractionChain = promptForJsonExtraction
    .pipe(testQuestionDataExtractionModel)
    .pipe(jsonOutputParser);

  const testResultsJson = await extractionChain.invoke({
    test: test,
  });

  const parsedTestResults = testQuestionObjectSchema.safeParse(testResultsJson);

  if (!parsedTestResults.success) {
    throw new Error("Parsing failed", {
      cause: parsedTestResults,
    });
  }

  return parsedTestResults.data;
};

export async function parseTestQuestions(test: string) {
  try {
    const parsedTestResults = await pRetry(
      async (attemptNumber) => {
        return await tryExtraction({
          attemptNumber: attemptNumber,
          test: test,
        });
      },
      {
        retries: MODEL_OPTIONS_RETRY.temperatures.length - 1,
      },
    );

    const {
      results: parsedQuestions,
      questionsInTest: hasQuestions,
      answersInTest: hasAnswers,
    } = parsedTestResults;

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
  }
}
export type ParsedQuestions = UnwrapPromise<
  ReturnType<typeof parseTestQuestions>
>;
