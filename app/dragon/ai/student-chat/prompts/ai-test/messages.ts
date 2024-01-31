import { getEngineeredMessages } from "./template";
import {
  ChatCompletionMessageParam,
  ChatCompletionSystemMessageParam,
} from "openai/resources";
import {
  AITestPreferences as AITestPreferencesTest,
  teacherPreferences as teacherPreferencesTest,
  studentPreferences as studentPreferencesTest,
} from "../../../../../../lib/schema/test-data";
import { AITestContextByChatId } from "./queries";
import { isEmptyObject } from "../chat/queries";
import * as z from "zod";
import { getFormattedGrade } from "@/app/dragon/teacher/utils";
import {
  AITestPreferenceSchema,
  StudentPreferenceSchema,
  teacherPreferencesSchema,
} from "@/lib/schema";

export const getPreferences = (context: AITestContextByChatId) => {
  let teacherPreferences = context?.teacherPreferences as z.infer<
    typeof teacherPreferencesSchema
  >;
  let lessonPreferences = context?.lessonPreferences as z.infer<
    typeof AITestPreferenceSchema
  >;

  let studentPreferences = context?.studentPreferences as z.infer<
    typeof StudentPreferenceSchema
  >;

  if (isEmptyObject(studentPreferences) || studentPreferences === undefined) {
    studentPreferences = studentPreferencesTest[0];
  }
  if (isEmptyObject(lessonPreferences) || lessonPreferences === undefined) {
    lessonPreferences = AITestPreferencesTest[0];
  }
  if (isEmptyObject(teacherPreferences) || teacherPreferences === undefined) {
    teacherPreferences = teacherPreferencesTest[0];
  }
  const teacherName = context?.teacherName;
  const studentName = context?.studentName;
  const {
    content,
    topic,
    subjects,
    tone,
    language,
    humorLevel,
    languageProficiency,
    mediumOfInstruction,
  } = lessonPreferences;
  const { personalInformation, professionalInformation, likes, dislikes } =
    teacherPreferences;

  const { aboutYourself, favoriteCartoons, favoriteFoods, interests } =
    studentPreferences;

  const unformattedGrade = context?.grade;
  const grade = unformattedGrade
    ? getFormattedGrade({ grade: unformattedGrade })
    : "Grade %";

  const stringifiedSubjects = JSON.stringify(subjects);

  const preferences = {
    teacherName,
    studentName,
    grade: grade,
    humorLevel,
    content,
    topic,
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
    mediumOfInstruction,
  } as const;
  return preferences;
};

export async function getEngineeredAITestBotMessages(
  context: AITestContextByChatId,
) {
  if (!context) {
    console.error("context not found for chatId:");
  }
  const preferences = getPreferences(context);
  const engineeredMessages = getEngineeredMessages({
    studentName: preferences.studentName,
    grade: preferences.grade,
    aboutYourself: preferences.aboutYourself,
    favoriteCartoons: preferences.favoriteCartoons,
    favoriteFoods: preferences.favoriteFoods,
    interests: preferences.interests,
    topic: preferences.topic,
    subjects: preferences.subjects,
    content: preferences.content,
    mediumOfInstruction: preferences.mediumOfInstruction,
  });

  return { engineeredMessages };
}
