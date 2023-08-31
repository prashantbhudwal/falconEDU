import { z } from "zod";
export const grades = [
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
] as const;
export const humorLevel = ["High", "Moderate", "Low"] as const;
export const board  = ["CBSE", "ICSE", "CIE"] as const ;

export const agentSchema = z.object({
  // Core Config
  nickname: z.string().min(1).max(20),
  instructions: z.string(),
  teacherIntro: z.string(),
  subjects: z.array(z.string()),
  grades: z.array(z.enum(grades)),
  board: z.enum(board),
  studentTechComfort: z.enum(["Beginner", "Intermediate", "Advanced"]),

  // Interaction
  tone: z.enum(["Friendly", "Professional", "Casual"]),
  languagePreferences: z.array(z.string()),
  feedbackLoop: z.boolean(),
  humorLevel: z.enum(humorLevel),
  languageGradeLevel: z.enum(grades),

  // Customization & Personalization
  customPhrases: z.array(z.string()),
  personalInterests: z.array(z.string()),
  motivation: z.string(),
  lifeExperience: z.array(z.string()),
  culturalBackground: z.string(),
  emojiUse: z.enum(["Often", "Rarely", "Never"]),
  preferredExamples: z.enum(["Real-world", "Historical", "Theoretical"]),
  debateTolerance: z.enum(["Encouraged", "Neutral", "Discouraged"]),

  // Student Info
});
