import { getEngineeredMessagesForChat } from "./chat-template";
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
import { getFormattedGrade } from "@/app/dragon/teacher/utils";
import { Grade } from "@prisma/client";

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

    tone,
    language,
    humorLevel,
    languageProficiency,
  } = botPreferences;
  const { personalInformation, professionalInformation, likes, dislikes } =
    teacherPreferences;
  const { aboutYourself, favoriteCartoons, favoriteFoods, interests } =
    studentPreferences;

  const unformattedGrade = context?.grade as Grade;
  const grade = unformattedGrade
    ? getFormattedGrade({ grade: unformattedGrade })
    : "Grade 5";

  const preferences = {
    teacherName,
    studentName,
    humorLevel,
    instructions,
    language,
    languageProficiency,
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
    grade,
  } as const;
  return preferences;
};

export async function getEngineeredChatBotMessages(
  context: ChatContextByChatId
) {
  if (!context) {
    console.error("context not found for chatId:");
  }

  const preferences = getPreferences(context);

  const engineeredMessages = getEngineeredMessagesForChat({
    teacherName: preferences.teacherName,
    studentName: preferences.studentName,
    grade: preferences.grade,
    instructions: preferences.instructions,
    name: preferences.name,
  });
  return { engineeredMessages };
}
