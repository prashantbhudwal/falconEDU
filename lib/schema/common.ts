import { z } from "zod";

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
