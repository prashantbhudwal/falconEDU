import { messageTemplates } from "./chat-template";
import { ChatPromptTemplate } from "langchain/prompts";
import {
  botPreferences as botPreferencesTest,
  teacherPreferences as teacherPreferencesTest,
  studentPreferences as studentPreferencesTest,
} from "../../../../test-data";
import { ChatContextByChatId, isEmptyObject } from "./queries";
import {
  botPreferencesSchema,
  teacherPreferencesSchema,
  StudentPreferenceSchema,
} from "../../../../schema";
import * as z from "zod";

export const getPreferences = (context: ChatContextByChatId) => {
  let teacherPreferences = context?.teacherPreferences as z.infer<
    typeof teacherPreferencesSchema
  >;
  let botPreferences = context?.botPreferences as z.infer<
    typeof botPreferencesSchema
  >;

  if (isEmptyObject(botPreferences) || botPreferences === undefined) {
    botPreferences = botPreferencesTest[0];
  }
  if (isEmptyObject(teacherPreferences) || teacherPreferences === undefined) {
    teacherPreferences = teacherPreferencesTest[0];
  }
  let studentPreferences = context?.studentPreferences as z.infer<
    typeof StudentPreferenceSchema
  >;

  if (isEmptyObject(studentPreferences) || studentPreferences === undefined) {
    studentPreferences = studentPreferencesTest[0];
  }
  const name = context?.name;
  const teacherName = context?.teacherName;
  const studentName = context?.studentName;
  const {
    instructions,
    subjects,
    grades,
    board,
    tone,
    language,
    humorLevel,
    languageProficiency,
  } = botPreferences;
  const { personalInformation, professionalInformation, likes, dislikes } =
    teacherPreferences;
  const { aboutYourself, favoriteCartoons, favoriteFoods, interests } =
    studentPreferences;

  const stringifiedGrades = JSON.stringify(grades);
  const stringifiedSubjects = JSON.stringify(subjects);

  const preferences = {
    teacherName,
    studentName,
    board,
    grades: stringifiedGrades,
    humorLevel,
    instructions,
    language,
    languageProficiency,
    subjects: stringifiedSubjects,
    tone,
    personalInformation,
    professionalInformation,
    likes,
    dislikes,
    aboutYourself,
    favoriteCartoons,
    favoriteFoods,
    interests,
    name,
  } as const;
  return preferences;
};

export async function getEngineeredChatBotMessages(
  context: ChatContextByChatId
) {
  if (!context) {
    console.error("context not found for chatId:");
  }
  const mergedSchema = botPreferencesSchema.merge(teacherPreferencesSchema);
  const preferences = getPreferences(context);
  const { systemTemplate, humanTemplate } = messageTemplates;

  const prompt = ChatPromptTemplate.fromMessages<z.infer<typeof mergedSchema>>([
    ["system", systemTemplate],
    ["human", humanTemplate],
  ]);
  const engineeredMessages = await prompt.formatMessages(preferences);
  console.log("engineeredMessages", engineeredMessages);
  return { engineeredMessages, prompt };
}
