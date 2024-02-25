import { z } from "zod";
import { humorLevel, language, languageProficiency, tone } from "../constants";
import { baseTaskSchema } from "../common";

export const LIMITS_lessonPreferencesSchema = {
  content: {
    maxLength: 5000,
  },
  topic: {
    maxLength: 140,
  },
};

export const LIMITS_lessonNameSchema = {
  name: {
    maxLength: 50,
    minLength: 3,
  },
};

export const videoSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  metadata: z.string().optional(),
});

export const videoArraySchema = z.array(videoSchema).optional();

export const lessonPreferencesSchema = baseTaskSchema.extend({
  content: baseTaskSchema.shape.content.max(
    LIMITS_lessonPreferencesSchema.content.maxLength,
  ),
  tone: z.enum(tone),
  language: z.enum(language),
  humorLevel: z.enum(humorLevel),
  languageProficiency: z.enum(languageProficiency),
  videos: videoArraySchema,
  hasEquations: z.boolean().optional(),
});

export const lessonNameSchema = z.object({
  name: z
    .string()
    .min(LIMITS_lessonNameSchema.name.minLength)
    .max(LIMITS_lessonNameSchema.name.maxLength),
});
