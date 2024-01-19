import { z } from "zod";
import { questionTypes } from "./ai/test-checker/tool";
export const grades = [
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
] as const;
export const humorLevel = ["Low", "Moderate", "High"] as const;
export const board = ["CBSE", "ICSE", "CIE", "IB", "IGCSE"] as const;
export const language = ["English", "Hindi", "Hinglish"] as const;
export const languageProficiency = [
  "Beginner",
  "Intermediate",
  "Advanced",
] as const;
export const tone = ["Friendly", "Strict"] as const;
export const subjects = [
  "Math",
  "Science",
  "Social Studies",
  "English",
  "Hindi",
  "Computer Science",
  "Art",
  "Music",
  "Physical Education",
  "Other",
] as const;

export const LIMITS_botPreferencesSchema = {
  instructions: {
    maxLength: 1500,
  },
};

export const LIMITS_lessonPreferencesSchema = {
  content: {
    maxLength: 3000,
  },
  topic: {
    maxLength: 140,
  },
};

export const LIMITS_AITestPreferencesSchema = {
  content: {
    maxLength: 3000,
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

export const LIMITS_botNameSchema = {
  name: {
    maxLength: 30,
    minLength: 3,
  },
};

export const LIMITS_AITestNameSchema = {
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
});

export const botNameSchema = z.object({
  name: z
    .string()
    .min(LIMITS_botNameSchema.name.minLength)
    .max(LIMITS_botNameSchema.name.maxLength),
});

export const lessonPreferencesSchema = z.object({
  topic: z.string().max(LIMITS_lessonPreferencesSchema.topic.maxLength),
  content: z.string().max(LIMITS_lessonPreferencesSchema.content.maxLength),
  subjects: z.array(z.string()),
  tone: z.enum(tone),
  language: z.enum(language),
  humorLevel: z.enum(humorLevel),
  languageProficiency: z.enum(languageProficiency),
});

export const lessonNameSchema = z.object({
  name: z
    .string()
    .min(LIMITS_lessonNameSchema.name.minLength)
    .max(LIMITS_lessonNameSchema.name.maxLength),
});

export const classNameSchema = z.object({
  name: z
    .string()
    .min(LIMITS_botNameSchema.name.minLength)
    .max(LIMITS_botNameSchema.name.maxLength),
});

// Schema: teacherPreferencesSchema
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

// Schema: StudentPreferencesSchema

export const LIMITS_StudentPreferencesSchema = {
  interests: {
    minLength: {
      message: "Interests is required",
      value: 1,
    },
    maxLength: {
      message: "Interests can't exceed 200 characters",
      value: 200,
    },
  },
  favoriteCartoons: {
    minLength: {
      message: "Favorite Cartoons is required",
      value: 1,
    },
    maxLength: {
      message: "Favorite Cartoons can't exceed 200 characters",
      value: 200,
    },
  },
  favoriteFoods: {
    minLength: {
      message: "Favorite Foods is required",
      value: 1,
    },
    maxLength: {
      message: "Favorite Foods can't exceed 200 characters",
      value: 200,
    },
  },
  aboutYourself: {
    minLength: {
      message: "About Yourself is required",
      value: 1,
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
      LIMITS_StudentPreferencesSchema.interests.minLength.message
    )
    .max(
      LIMITS_StudentPreferencesSchema.interests.maxLength.value,
      LIMITS_StudentPreferencesSchema.interests.maxLength.message
    )
    .optional(),
  favoriteCartoons: z
    .string()
    .min(
      LIMITS_StudentPreferencesSchema.favoriteCartoons.minLength.value,
      LIMITS_StudentPreferencesSchema.favoriteCartoons.minLength.message
    )
    .max(
      LIMITS_StudentPreferencesSchema.favoriteCartoons.maxLength.value,
      LIMITS_StudentPreferencesSchema.favoriteCartoons.maxLength.message
    )
    .optional(),
  favoriteFoods: z
    .string()
    .min(
      LIMITS_StudentPreferencesSchema.favoriteFoods.minLength.value,
      LIMITS_StudentPreferencesSchema.favoriteFoods.minLength.message
    )
    .max(
      LIMITS_StudentPreferencesSchema.favoriteFoods.maxLength.value,
      LIMITS_StudentPreferencesSchema.favoriteFoods.maxLength.message
    )
    .optional(),
  aboutYourself: z
    .string()
    .min(
      LIMITS_StudentPreferencesSchema.aboutYourself.minLength.value,
      LIMITS_StudentPreferencesSchema.aboutYourself.minLength.message
    )
    .max(
      LIMITS_StudentPreferencesSchema.aboutYourself.maxLength.value,
      LIMITS_StudentPreferencesSchema.aboutYourself.maxLength.message
    )
    .optional(),
});

// Schema: testBotPreferencesSchema
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
    })
  ),
  options: z.array(
    z.object({
      value: z.string().min(1, {
        message: "Options must be at least 1 characters",
      }),
    })
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

export const AITestPreferenceSchema = z.object({
  topic: z.string().max(LIMITS_AITestPreferencesSchema.topic.maxLength),
  content: z.string().max(LIMITS_AITestPreferencesSchema.content.maxLength),
  subjects: z.array(z.string()),
  tone: z.enum(tone),
  language: z.enum(language),
  humorLevel: z.enum(humorLevel),
  languageProficiency: z.enum(languageProficiency),
});

export const AITestNameSchema = z.object({
  name: z
    .string()
    .min(LIMITS_AITestNameSchema.name.minLength)
    .max(LIMITS_AITestNameSchema.name.maxLength),
});

// Exhaustive bot preferences schema
// export const exhaustiveBotPreferencesSchema = z.object({
//   // Core Config
//   nickname: z.string().min(1).max(20),
//   instructions: z.string().max(1500),
//   subjects: z.array(z.string()),
//   grades: z.array(z.enum(grades)),
//   board: z.enum(board),
//   tone: z.enum(tone),
//   language: z.enum(language),
//   // feedbackLoop: z.boolean(),
//   humorLevel: z.enum(humorLevel),
//   languageProficiency: z.enum(languageProficiency),

//   // Customization & Personalization
//   customPhrases: z.array(z.string()),
//   personalInterests: z.array(z.string()),
//   motivation: z.string(),
//   lifeExperience: z.array(z.string()),
//   culturalBackground: z.string(),
//   emojiUse: z.enum(["Often", "Rarely", "Never"]),
//   preferredExamples: z.enum(["Real-world", "Historical", "Theoretical"]),
//   debateTolerance: z.enum(["Encouraged", "Neutral", "Discouraged"]),
// });
