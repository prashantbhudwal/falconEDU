import { z } from "zod";

export const agentSchema = z.object({
  // Core Config
  instructions: z.string(), // Textbox
  teacherIntro: z.string(),
  tone: z.enum(["Friendly", "Professional", "Casual"]),
  responseTime: z.union([
    z.literal("Instant"),
    z.literal("1 Min"),
    z.literal("5 Min"),
  ]),
  subjects: z.array(z.string()),

  // Interaction
  languagePreferences: z.array(z.string()),
  feedbackLoop: z.boolean(),
  humorLevel: z.enum(["High", "Moderate", "Low"]),

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
  targetGradeLevels: z.array(
    z.enum(["Elementary", "High School", "College", "Postgraduate"])
  ),
  targetBoards: z.array(z.string()),
  targetCourseTypes: z.array(z.string()),
  studentTechComfort: z.enum(["Beginner", "Intermediate", "Advanced"]),
  parentInvolvement: z.enum(["High", "Low", "None"]),
});


