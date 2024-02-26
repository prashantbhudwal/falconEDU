import { z } from "zod";

export const LIMITS_StudentPreferencesSchema = {
  interests: {
    minLength: {
      message: "Interests is required",
      value: 0,
    },
    maxLength: {
      message: "Interests can't exceed 200 characters",
      value: 200,
    },
  },
  favoriteCartoons: {
    minLength: {
      message: "Favorite Cartoons is required",
      value: 0,
    },
    maxLength: {
      message: "Favorite Cartoons can't exceed 200 characters",
      value: 200,
    },
  },
  favoriteFoods: {
    minLength: {
      message: "Favorite Foods is required",
      value: 0,
    },
    maxLength: {
      message: "Favorite Foods can't exceed 200 characters",
      value: 200,
    },
  },
  aboutYourself: {
    minLength: {
      message: "About Yourself is required",
      value: 0,
    },
    maxLength: {
      message: "About Yourself can't exceed 500 characters",
      value: 500,
    },
  },
};

export const StudentPreferenceSchema = z.object({
  interests: z
    .string()
    .min(
      LIMITS_StudentPreferencesSchema.interests.minLength.value,
      LIMITS_StudentPreferencesSchema.interests.minLength.message,
    )
    .max(
      LIMITS_StudentPreferencesSchema.interests.maxLength.value,
      LIMITS_StudentPreferencesSchema.interests.maxLength.message,
    )
    .optional(),
  favoriteCartoons: z
    .string()
    .min(
      LIMITS_StudentPreferencesSchema.favoriteCartoons.minLength.value,
      LIMITS_StudentPreferencesSchema.favoriteCartoons.minLength.message,
    )
    .max(
      LIMITS_StudentPreferencesSchema.favoriteCartoons.maxLength.value,
      LIMITS_StudentPreferencesSchema.favoriteCartoons.maxLength.message,
    )
    .optional(),
  favoriteFoods: z
    .string()
    .min(
      LIMITS_StudentPreferencesSchema.favoriteFoods.minLength.value,
      LIMITS_StudentPreferencesSchema.favoriteFoods.minLength.message,
    )
    .max(
      LIMITS_StudentPreferencesSchema.favoriteFoods.maxLength.value,
      LIMITS_StudentPreferencesSchema.favoriteFoods.maxLength.message,
    )
    .optional(),
  aboutYourself: z
    .string()
    .min(
      LIMITS_StudentPreferencesSchema.aboutYourself.minLength.value,
      LIMITS_StudentPreferencesSchema.aboutYourself.minLength.message,
    )
    .max(
      LIMITS_StudentPreferencesSchema.aboutYourself.maxLength.value,
      LIMITS_StudentPreferencesSchema.aboutYourself.maxLength.message,
    )
    .optional(),
});
