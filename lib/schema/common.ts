import { z } from "zod";
import { mediumOfInstruction } from "./constants";

export const LIMITS_classNameSchema = {
  name: {
    maxLength: 30,
    minLength: 3,
  },
};

export const classNameSchema = z.object({
  name: z
    .string()
    .min(LIMITS_classNameSchema.name.minLength)
    .max(LIMITS_classNameSchema.name.maxLength),
});

export const LIMITS_base = {
  topic: {
    maxLength: 140,
  },
  content: {
    maxLength: 5000,
  },
};

export const baseTaskSchema = z.object({
  topic: z.string().max(LIMITS_base.topic.maxLength),
  subjects: z.array(z.string()),
  mediumOfInstruction: z.enum(mediumOfInstruction).optional(),
  content: z.string(),
});
