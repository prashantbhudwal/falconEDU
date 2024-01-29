import { questionTypes } from "@/app/dragon/ai/test-checker/tool";
import * as z from "zod";
import { mediumOfInstruction } from "../constants";

export const LIMITS_testBotPreferencesSchema = {
  fullTest: {
    maxLength: 2500,
  },
};
export const testBotPreferencesSchema = z.object({
  fullTest: z.string().max(LIMITS_testBotPreferencesSchema.fullTest.maxLength),
  timeLimit: z
    .number()
    .min(0, { message: "Time limit must be at least 0" })
    .max(180, { message: "Time limit must not exceed 180" })
    .optional(),
});

export const parsedQuestionsSchema = z.object({
  correct_answer: z.array(
    z.object({
      value: z.string().min(1, {
        message: "Answer must be at least 1 characters",
      }),
    }),
  ),
  options: z.array(
    z.object({
      value: z.string().min(1, {
        message: "Options must be at least 1 characters",
      }),
    }),
  ),
  question: z
    .string()
    .min(1, {
      message: "Question must be at least 1 characters.",
    })
    .max(1000, {
      message: "Question must not exceed 1000 characters.",
    }),
  question_type: z.enum(questionTypes),
  //later add other properties like hint , description , questionType etc...
});
