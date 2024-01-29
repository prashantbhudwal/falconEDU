import { ChatOpenAI } from "langchain/chat_models/openai";
import * as z from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const bloomLevel = z
  .enum([
    "knowledge",
    "comprehension",
    "application",
    "analysis",
    "synthesis",
    "evaluation",
  ])
  .describe("Level of cognitive skill based on Bloom’s taxonomy");

const learningGoal = z.object({
  goalNumber: z
    .number()
    .min(1)
    .max(100)
    .describe("The serial number learning goal number"),
  goal: z.string().describe("The learning goal"),
  level: z
    .enum(["Beginner", "Intermediate", "Advanced"])
    .describe("Educational level or difficulty"),
  cognitiveSkillLevel: bloomLevel,
  measurableOutcome: z
    .string()
    .describe("Specific, measurable outcomes or competencies"),
  relevance: z
    .string()
    .describe("Explanation of the goal's real-world relevance"),
  prerequisites: z
    .array(z.string())
    .describe("List of prerequisites or foundational knowledge"),
  assessmentMethod: z
    .string()
    .describe("Method of assessing the learning goal"),
});

const conciseLearningGoal = learningGoal.pick({
  goal: true,
  cognitiveSkillLevel: true,
  goalNumber: true,
});

const learningGoalSchema = z.array(conciseLearningGoal);

export type LearningGoals = z.infer<typeof learningGoalSchema>;

export const learningGoalObjectSchema = z.object({
  learningGoals: learningGoalSchema
    .describe("The array of learning goals. Empty if no learning goals in test")
    .optional(),
});

export const generateLearningGoals = {
  name: "generateLearningGoals",
  description:
    "Converts the <content> provided into learning goals based on the <guidelines>.",
  parameters: zodToJsonSchema(learningGoalObjectSchema),
};

//Infer TYpes from Zod Schema

const MODEL_OPTIONS = {
  name: "gpt-3.5-turbo-1106",
  temperature: 1,
};

export const baseModel = new ChatOpenAI({
  modelName: MODEL_OPTIONS.name,
  temperature: MODEL_OPTIONS.temperature,
});

export const learningGoalsGenerationModel = baseModel.bind({
  functions: [generateLearningGoals],
  function_call: { name: "generateLearningGoals" },
});
