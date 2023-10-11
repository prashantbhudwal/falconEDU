import { z } from "zod";
export const grades = [
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
] as const;
export const humorLevel = ["High", "Moderate", "Low"] as const;
export const board = ["CBSE", "ICSE", "CIE"] as const;
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

export const botSchema = z.object({
  // Core Config
  nickname: z.string().min(1).max(20),
  instructions: z.string(),
  subjects: z.array(z.string()),
  grades: z.array(z.enum(grades)),
  board: z.enum(board),
  tone: z.enum(tone),
  language: z.enum(language),
  // feedbackLoop: z.boolean(),
  humorLevel: z.enum(humorLevel),
  languageProficiency: z.enum(languageProficiency),

  // Customization & Personalization
  customPhrases: z.array(z.string()),
  personalInterests: z.array(z.string()),
  motivation: z.string(),
  lifeExperience: z.array(z.string()),
  culturalBackground: z.string(),
  emojiUse: z.enum(["Often", "Rarely", "Never"]),
  preferredExamples: z.enum(["Real-world", "Historical", "Theoretical"]),
  debateTolerance: z.enum(["Encouraged", "Neutral", "Discouraged"]),
});

export const teacherPreferencesSchema = z.object({
  professionalInformation: z.string().min(50).max(500).optional(),
  personalInformation: z.string().min(50).max(500).optional(),
  likes: z.string().min(50).max(500).optional(),
  dislikes: z.string().min(50).max(500).optional(),
});

export const botPreferencesSchema = botSchema.pick({
  instructions: true,
  subjects: true,
  grades: true,
  board: true,
  tone: true,
  language: true,
  humorLevel: true,
  languageProficiency: true,
});

export const StudentPreferencesSchema = z.object({
  grade: z.enum(grades),
  board: z.enum(board),
  likes: z.string().min(20).max(500).optional(),
  dislikes: z.string().min(20).max(500).optional(),
});

export const testBotPreferencesSchema = z.object({
  fullTest: z.string().max(1500),
});
