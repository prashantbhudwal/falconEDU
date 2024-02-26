import { z } from "zod";
import { AITestPreferenceSchema } from "./tasks/ai-test";
import { lessonPreferencesSchema } from "./tasks/lesson";
import { testBotPreferencesSchema } from "./tasks/test";
import { botPreferencesSchema } from "./tasks/bot";
import { StudentPreferenceSchema } from "./users/student";
import { teacherPreferencesSchema } from "./users/teacher";

const defaultValuesForAITest: z.infer<typeof AITestPreferenceSchema> = {
  topic: "",
  content: "",
  subjects: [],
  tone: "Friendly",
  language: "English",
  humorLevel: "Moderate",
  languageProficiency: "Beginner",
  mediumOfInstruction: "english",
  hasEquations: false,
  autoCheck: true,
};

const defaultValuesForLesson: z.infer<typeof lessonPreferencesSchema> = {
  topic: "",
  content: "",
  subjects: [],
  tone: "Friendly",
  language: "English",
  humorLevel: "Moderate",
  languageProficiency: "Beginner",
  mediumOfInstruction: "english",
  videos: [],
  hasEquations: false,
};

const defaultValuesForTest: z.infer<typeof testBotPreferencesSchema> = {
  fullTest: "",
  hasEquations: false,
  autoCheck: true,
};

const defaultValuesForBot: z.infer<typeof botPreferencesSchema> = {
  instructions: "",
  tone: "Friendly",
  language: "English",
  humorLevel: "Moderate",
  languageProficiency: "Beginner",
  mediumOfInstruction: "english",
  hasEquations: false,
};

const defaultValuesForStudentPreferences: z.infer<
  typeof StudentPreferenceSchema
> = {
  interests: "",
  favoriteCartoons: "",
  favoriteFoods: "",
  aboutYourself: "",
};
const defaultValuesTeacherPreferences: z.infer<
  typeof teacherPreferencesSchema
> = {
  personalInformation: "",
  professionalInformation: "",
  likes: "",
  dislikes: "",
};

export const defaultValues = {
  tasks: {
    chat: defaultValuesForBot,
    lesson: defaultValuesForLesson,
    test: defaultValuesForTest,
    "ai-test": defaultValuesForAITest,
  },
  preferences: {
    studentPreferences: defaultValuesForStudentPreferences,
    teacherPreferences: defaultValuesTeacherPreferences,
  },
} as const;
