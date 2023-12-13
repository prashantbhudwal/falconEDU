import { z } from "zod";
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
export const humorLevel = ["High", "Moderate", "Low"] as const;
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
    maxLength: 1500,
  },
  topic: {
    maxLength: 30,
  },
};

export const LIMITS_lessonNameSchema = {
  name: {
    maxLength: 30,
    minLength: 3,
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
  subjects: z.array(z.string()),
  grades: z.array(z.enum(grades)),
  board: z.enum(board),
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
  grades: z.array(z.enum(grades)),
  board: z.enum(board),
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
  likes: {
    minLength: 20,
    maxLength: 500,
  },
  dislikes: {
    minLength: 20,
    maxLength: 500,
  },
};

export const StudentPreferencesSchema = z.object({
  grade: z.enum(grades),
  board: z.enum(board),
  likes: z
    .string()
    .min(LIMITS_StudentPreferencesSchema.likes.minLength)
    .max(LIMITS_StudentPreferencesSchema.likes.maxLength)
    .optional(),
  dislikes: z
    .string()
    .min(LIMITS_StudentPreferencesSchema.dislikes.minLength)
    .max(LIMITS_StudentPreferencesSchema.dislikes.maxLength)
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
  question_type: z.enum([
    "OBJECTIVE_MULTIPLE_CHOICE_SINGLE_ANSWER",
    "OBJECTIVE_TRUE_FALSE",
    "OBJECTIVE_FILL_IN_THE_BLANK_SINGLE_ANSWER",
    "OBJECTIVE_FILL_IN_THE_BLANK_MULTIPLE_ANSWER",
    "OBJECTIVE_MATCH_THE_FOLLOWING",
    "OBJECTIVE_MULTIPLE_CHOICE_MULTIPLE_ANSWER",
    "SUBJECTIVE_ESSAY",
    "SUBJECTIVE_SHORT_ANSWER",
    "OTHER",
  ]),
  //later add other properties like hint , description , questionType etc...
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
