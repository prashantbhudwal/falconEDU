import { ChatOpenAI } from "langchain/chat_models/openai";
import * as z from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const testResultsSchema = z.array(
  z.object({
    question_number: z.number().describe("Question number of the test"),
    student_answer: z.array(
      z.string().describe("Answer provided by the student in chat")
    ),
    correct_answer: z.array(
      z.string().describe("Correct answer for the question")
    ),
    isCorrect: z
      .boolean()
      .describe("If the user answer and correct answer is equal"),
    question: z.string().describe("The question asked"),
  })
);
export type TestResults = z.infer<typeof testResultsSchema>;

export const testResultsObjectSchema = z.object({
  results: testResultsSchema,
});

export const extractTestResultsAsJson = {
  name: "extractTestResultsAsJson",
  description: "Converts the test results of the test into to JSON",
  parameters: zodToJsonSchema(testResultsObjectSchema),
};

//Infer TYpes from Zod Schema

const MODEL_OPTIONS = {
  name: "gpt-3.5-turbo-1106",
  temperature: 0,
};

export const baseModel = new ChatOpenAI({
  modelName: MODEL_OPTIONS.name,
  temperature: MODEL_OPTIONS.temperature,
});

export const testDataExtractionModel = baseModel.bind({
  functions: [extractTestResultsAsJson],
  function_call: { name: "extractTestResultsAsJson" },
});
