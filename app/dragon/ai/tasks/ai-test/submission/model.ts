import { ChatOpenAI } from "langchain/chat_models/openai";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export const gradeDescriptionsObject = {
  a: "a:Exceeds Expectations: Exceptional performance and understanding",
  b: "b:Meets Expectations: Good understanding and application",
  c: "c:Approaching Expectations: Basic understanding, needs improvement",
  d: "d:Below Expectations: Limited understanding, significant improvement needed",
  f: "f:Fails to Meet Expectations: Inadequate understanding, not meeting basic requirements",
} as const;

const gradeEnum = z
  .enum(["a", "b", "c", "d", "f"])
  .describe("The grade assigned to the goal");

const gradeDescriptions = [
  "a:Exceeds Expectations: Exceptional performance and understanding",
  "b:Meets Expectations: Good understanding and application",
  "c:Approaching Expectations: Basic understanding, needs improvement",
  "d:Below Expectations: Limited understanding, significant improvement needed",
  "f:Fails to Meet Expectations: Inadequate understanding, not meeting basic requirements",
] as const;

const gradeDescriptionEnum = z
  .enum(gradeDescriptions)
  .describe("The description of the grade assigned to the goal");

export const goalAssessmentResult = z.object({
  goalNumber: z.number().describe("The serial number of the goal in the list."),
  goal: z.string().describe("The exact learning goal in the goal list"),
  gradeDescription: gradeDescriptionEnum,
  gradeAssigned: gradeEnum,
});

const goalAssessmentResults = z.array(goalAssessmentResult);

export const goalAssessmentObjectSchema = z.object({
  goalAssessmentResults: goalAssessmentResults,
});

export const gradeLearningGoals = {
  name: "gradeLearningGoals",
  description:
    "Grades the learning goals based on the <guidelines> and <content> provided.",
  parameters: zodToJsonSchema(goalAssessmentObjectSchema),
};

//Infer TYpes from Zod Schema
export type GoalAssessment = z.infer<typeof goalAssessmentResult>;

export type GoalAssessmentResults = z.infer<typeof goalAssessmentResults>;

export type GoalAssessmentObject = z.infer<typeof goalAssessmentObjectSchema>;

export const goalAssessmentSchemaWithIdSchemaArray = z.array(
  goalAssessmentResult.extend({
    id: z.string(),
  }),
);

export type GoalAssessmentObjectWithIdArray = z.infer<
  typeof goalAssessmentSchemaWithIdSchemaArray
>;

export type SingleGoalAssessmentWithId =
  GoalAssessmentObjectWithIdArray[number];

const MODEL_OPTIONS = {
  temperature: 1,
  name: "gpt-3.5-turbo-1106",
};

export const baseModel = new ChatOpenAI({
  modelName: MODEL_OPTIONS.name,
  temperature: MODEL_OPTIONS.temperature,
});

export const gradeLearningGoalsModel = baseModel.bind({
  functions: [gradeLearningGoals],
  function_call: { name: "gradeLearningGoals" },
});
