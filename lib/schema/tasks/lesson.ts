import { z } from "zod";
import {
  humorLevel,
  language,
  languageProficiency,
  mediumOfInstruction,
  tone,
} from "../constants";

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

export const lessonPreferencesSchema = z.object({
  topic: z.string().max(LIMITS_lessonPreferencesSchema.topic.maxLength),
  content: z.string().max(LIMITS_lessonPreferencesSchema.content.maxLength),
  subjects: z.array(z.string()),
  tone: z.enum(tone),
  language: z.enum(language),
  humorLevel: z.enum(humorLevel),
  languageProficiency: z.enum(languageProficiency),
  mediumOfInstruction: z.enum(mediumOfInstruction).optional(),
  videos: videoArraySchema,
});

export const lessonNameSchema = z.object({
  name: z
    .string()
    .min(LIMITS_lessonNameSchema.name.minLength)
    .max(LIMITS_lessonNameSchema.name.maxLength),
});
