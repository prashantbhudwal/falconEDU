import { ChatOpenAI } from "langchain/chat_models/openai";
import * as z from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { QuestionTypeSchema } from "../test-checker/tool";

const testQuestionsSchema = z.array(
  z.object({
    question_number: z.number().describe("Question number of the test"),
    correct_answer: z.array(
      z.string().describe("Correct answer for the question")
    ),
    options: z.array(z.string().describe("Options for the question")),
    question: z.string().describe("The question asked"),
    question_type: QuestionTypeSchema,
  })
);
export type TestQuestions = z.infer<typeof testQuestionsSchema>;

export const testQuestionObjectSchema = z.object({
  questionsInTest: z
    .boolean()
    .describe("Whether questions are provided in test."),
  answersInTest: z
    .boolean()
    .describe("Whether answers are provided in the test."),
  results: testQuestionsSchema
    .optional()
    .describe("The array of questions. Empty if no questions in test"),
});

export const extractTestQuestionsAsJson = {
  name: "extractTestQuestionsAsJson",
  description: "Converts the test into to JSON",
  parameters: zodToJsonSchema(testQuestionObjectSchema),
};

//Infer TYpes from Zod Schema

const MODEL_OPTIONS = {
  name: "gpt-4-1106-preview",
  temperature: 0,
};

export const baseModel = new ChatOpenAI({
  modelName: MODEL_OPTIONS.name,
  temperature: MODEL_OPTIONS.temperature,
});

export const testQuestionDataExtractionModel = baseModel.bind({
  functions: [extractTestQuestionsAsJson],
  function_call: { name: "extractTestQuestionsAsJson" },
});
