import { ChatOpenAI } from "langchain/chat_models/openai";
import * as z from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const QuestionTypeSchema = z.enum([
  "OBJECTIVE_MULTIPLE_CHOICE_SINGLE_ANSWER",
  "OBJECTIVE_TRUE_FALSE",
  "OBJECTIVE_FILL_IN_THE_BLANK_SINGLE_ANSWER",
  "OBJECTIVE_FILL_IN_THE_BLANK_MULTIPLE_ANSWER",
  "OBJECTIVE_MATCH_THE_FOLLOWING",
  "OBJECTIVE_MULTIPLE_CHOICE_MULTIPLE_ANSWER",
  "SUBJECTIVE_ESSAY",
  "SUBJECTIVE_SHORT_ANSWER",
  "OTHER",
]);
// Define the rest of the related schemas if necessary
export const TestResultsAnswerSchema = z.object({
  question_type: QuestionTypeSchema,
  question: z.string().describe("The question asked"),
  hint: z.string().optional().describe("The hint, if provided"),
  question_number: z.number().describe("Question number of the test"),
  correct_answer: z.array(
    z.string().describe("Correct answer for the question")
  ),
  sample_answer: z
    .string()
    .optional()
    .describe("Sample answer for the test, if provided"),
  max_score: z.number().optional(),
  student_answer: z.array(
    z.string().describe("Answer provided by the student in chat")
  ),
  isCorrect: z
    .boolean()
    .describe("If the user answer and correct answer is equal"),
});

const TestResultsSchema = z.array(TestResultsAnswerSchema);

export type TestResults = z.infer<typeof TestResultsSchema>;

export const testResultsObjectSchema = z.object({
  results: TestResultsSchema,
});

export const checkTest = {
  name: "checkTest",
  description: "Checks the test based on answers provided",
  parameters: zodToJsonSchema(testResultsObjectSchema),
};
//Infer TYpes from Zod Schem

const MODEL_OPTIONS = {
  name: "gpt-4-1106-preview",
  temperature: 0,
};

export const baseModel = new ChatOpenAI({
  modelName: MODEL_OPTIONS.name,
  temperature: MODEL_OPTIONS.temperature,
});

export const testCheckingModel = baseModel.bind({
  functions: [checkTest],
  function_call: { name: "checkTest" },
});
