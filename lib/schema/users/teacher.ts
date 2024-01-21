import { z } from "zod";

export const LIMITS_teacherPreferencesSchema = {
  professionalInformation: {
    minLength: 50,
    maxLength: 500,
  },
  personalInformation: {
    minLength: 50,
    maxLength: 500,
  },
  likes: {
    minLength: 50,
    maxLength: 500,
  },
  dislikes: {
    minLength: 50,
    maxLength: 500,
  },
};

export const teacherPreferencesSchema = z.object({
  professionalInformation: z
    .string()
    .min(LIMITS_teacherPreferencesSchema.professionalInformation.minLength, {
      message:
        "Professional information must adhere to a character limit of 50-500.",
    })
    .max(LIMITS_teacherPreferencesSchema.professionalInformation.maxLength, {
      message:
        "Professional information must adhere to a character limit of 50-500.",
    })
    .optional(),
  personalInformation: z
    .string()
    .min(LIMITS_teacherPreferencesSchema.personalInformation.minLength, {
      message:
        "Personal information must adhere to a character limit of 50-500.",
    })
    .max(LIMITS_teacherPreferencesSchema.personalInformation.maxLength, {
      message:
        "Personal information must adhere to a character limit of 50-500.",
    })
    .optional(),
  likes: z
    .string()
    .min(LIMITS_teacherPreferencesSchema.likes.minLength, {
      message: "Likes must adhere to a character limit of 50-500.",
    })
    .max(LIMITS_teacherPreferencesSchema.likes.maxLength, {
      message: "Likes must adhere to a character limit of 50-500.",
    })
    .optional(),
  dislikes: z
    .string()
    .min(LIMITS_teacherPreferencesSchema.dislikes.minLength, {
      message: "Dislikes must adhere to a character limit of 50-500.",
    })
    .max(LIMITS_teacherPreferencesSchema.dislikes.maxLength, {
      message: "Dislikes must adhere to a character limit of 50-500.",
    })
    .optional(),
});
