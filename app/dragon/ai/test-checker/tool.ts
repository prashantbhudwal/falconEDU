import * as z from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { QuestionType } from "@prisma/client"; // Find a way to type check question type with prisma

export const questionTypes = [
  "OBJECTIVE_MULTIPLE_CHOICE_SINGLE_ANSWER",
  "OBJECTIVE_TRUE_FALSE",
  "OBJECTIVE_FILL_IN_THE_BLANK_SINGLE_ANSWER",
  "OBJECTIVE_FILL_IN_THE_BLANK_MULTIPLE_ANSWER",
  "OBJECTIVE_MATCH_THE_FOLLOWING",
  "OBJECTIVE_MULTIPLE_CHOICE_MULTIPLE_ANSWER",
  "SUBJECTIVE_ESSAY",
  "SUBJECTIVE_SHORT_ANSWER",
  "OTHER",
] as const;

export const QuestionTypeSchema = z
  .enum(questionTypes)
  .describe("The type of question asked");

export const TestResultsAnswerSchema = z.object({
  question_type: QuestionTypeSchema,
  question: z.string().describe("The question asked"),
  hint: z.string().optional().describe("The hint, if provided"),
  question_number: z
    .number()
    .min(1)
    .max(100)
    .describe(
      "The serial number of each question in the test. The question asked FIRST in the test is numbered as 1, and so on. Never count duplicate questions. The serial number of the question is the same as the serial number of the question in the test."
    ),
  options: z.array(
    z.string().describe("Options for the question, if provided")
  ),
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

export const testResultsObjectSchema = z.object({
  results: TestResultsSchema,
});

export const testCheckingTool = {
  name: "checkTest",
  description: "Checks the test based on answers provided",
  parameters: zodToJsonSchema(testResultsObjectSchema),
};

export type TestResults = z.infer<typeof TestResultsSchema>;

export type TestResultsObject = z.infer<typeof testResultsObjectSchema>;

export const testResultObjectWithIdSchema = z.array(
  TestResultsAnswerSchema.extend({
    id: z.string(),
  })
);
export type TestResultObjectWithIdArray = z.infer<
  typeof testResultObjectWithIdSchema
>;

export type SingleTestResultWithID = TestResultObjectWithIdArray[number];
