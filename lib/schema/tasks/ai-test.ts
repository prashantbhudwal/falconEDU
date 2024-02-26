import { z } from "zod";
import {
  humorLevel,
  language,
  languageProficiency,
  mediumOfInstruction,
  tone,
} from "../constants";
import { baseTaskSchema } from "../common";

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

export const AITestPreferenceSchema = baseTaskSchema.extend({
  content: baseTaskSchema.shape.content.max(
    LIMITS_AITestPreferencesSchema.content.maxLength,
  ),
  tone: z.enum(tone),
  language: z.enum(language),
  humorLevel: z.enum(humorLevel),
  languageProficiency: z.enum(languageProficiency),
  hasEquations: z.boolean().optional(),
  autoCheck: z.boolean().optional(),
});
