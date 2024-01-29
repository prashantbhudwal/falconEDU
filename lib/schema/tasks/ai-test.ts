import { z } from "zod";
import {
  humorLevel,
  language,
  languageProficiency,
  mediumOfInstruction,
  tone,
} from "../constants";

export const LIMITS_AITestNameSchema = {
  name: {
    maxLength: 30,
    minLength: 3,
  },
};

export const AITestNameSchema = z.object({
  name: z
    .string()
    .min(LIMITS_AITestNameSchema.name.minLength)
    .max(LIMITS_AITestNameSchema.name.maxLength),
});

export const LIMITS_AITestPreferencesSchema = {
  content: {
    maxLength: 3000,
  },
  topic: {
    maxLength: 140,
  },
};

export const AITestPreferenceSchema = z.object({
  topic: z.string().max(LIMITS_AITestPreferencesSchema.topic.maxLength),
  content: z.string().max(LIMITS_AITestPreferencesSchema.content.maxLength),
  subjects: z.array(z.string()),
  tone: z.enum(tone),
  language: z.enum(language),
  humorLevel: z.enum(humorLevel),
  languageProficiency: z.enum(languageProficiency),
  mediumOfInstruction: z.enum(mediumOfInstruction).optional(),
});
