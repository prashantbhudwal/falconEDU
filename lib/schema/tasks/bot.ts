import { z } from "zod";
import {
  humorLevel,
  language,
  languageProficiency,
  mediumOfInstruction,
  tone,
} from "../constants";

export const LIMITS_botPreferencesSchema = {
  instructions: {
    maxLength: 1500,
  },
};

export const LIMITS_botNameSchema = {
  name: {
    maxLength: 30,
    minLength: 3,
  },
};

export const botPreferencesSchema = z.object({
  instructions: z
    .string()
    .max(LIMITS_botPreferencesSchema.instructions.maxLength),

  tone: z.enum(tone),
  language: z.enum(language),
  humorLevel: z.enum(humorLevel),
  languageProficiency: z.enum(languageProficiency),
  mediumOfInstruction: z.enum(mediumOfInstruction).optional(),
  hasEquations: z.boolean().optional(),
});

export const botNameSchema = z.object({
  name: z
    .string()
    .min(LIMITS_botNameSchema.name.minLength)
    .max(LIMITS_botNameSchema.name.maxLength),
});
