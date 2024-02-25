import { getEngineeredMessagesForLesson } from "./template";
import {
  lessonPreferences as lessonPreferencesTest,
  teacherPreferences as teacherPreferencesTest,
  studentPreferences as studentPreferencesTest,
} from "@/lib/schema/test-data";
import { LessonContextByChatId } from "./queries";
import { isEmptyObject } from "../chat/queries";

import * as z from "zod";
import { getFormattedGrade } from "@/app/dragon/teacher/utils";
import {
  StudentPreferenceSchema,
  lessonPreferencesSchema,
  teacherPreferencesSchema,
} from "@/lib/schema";

export const getPreferences = (context: LessonContextByChatId) => {
  let teacherPreferences = context?.teacherPreferences as z.infer<
    typeof teacherPreferencesSchema
  >;
  let lessonPreferences = context?.lessonPreferences as z.infer<
    typeof lessonPreferencesSchema
  >;

  let studentPreferences = context?.studentPreferences as z.infer<
    typeof StudentPreferenceSchema
  >;

  if (isEmptyObject(studentPreferences) || studentPreferences === undefined) {
    studentPreferences = studentPreferencesTest[0];
  }
  if (isEmptyObject(lessonPreferences) || lessonPreferences === undefined) {
    lessonPreferences = lessonPreferencesTest[0];
  }
  if (isEmptyObject(teacherPreferences) || teacherPreferences === undefined) {
    teacherPreferences = teacherPreferencesTest[0];
  }
  const { teacherName, studentName } = context ?? {};
  const { subjects, ...lessonPreferencesWithoutSubjects } = lessonPreferences;
  const grade = context?.grade
    ? getFormattedGrade({ grade: context?.grade })
    : "Grade %";
  const stringifiedSubjects = JSON.stringify(subjects);
  const preferences = {
    teacherName,
    studentName,
    grade,
    subjects: stringifiedSubjects,
    ...lessonPreferencesWithoutSubjects,
    ...teacherPreferences,
    ...studentPreferences,
  } as const;
  return preferences;
};

export async function getEngineeredLessonBotMessages(
  context: LessonContextByChatId,
) {
  if (!context) {
    console.error("context not found for chatId:");
  }
  const preferences = getPreferences(context);

  const engineeredMessages = getEngineeredMessagesForLesson({
    aboutYourself: preferences.aboutYourself,
    favoriteCartoons: preferences.favoriteCartoons,
    favoriteFoods: preferences.favoriteFoods,
    grade: preferences.grade,
    humorLevel: preferences.humorLevel,
    interests: preferences.interests,
    language: preferences.language,
    languageProficiency: preferences.languageProficiency,
    likes: preferences.likes,
    dislikes: preferences.dislikes,
    personalInformation: preferences.personalInformation,
    professionalInformation: preferences.professionalInformation,
    studentName: preferences.studentName,
    subjects: preferences.subjects,
    teacherName: preferences.teacherName,
    topic: preferences.topic,
    tone: preferences.tone,
    content: preferences.content,
    mediumOfInstruction: preferences.mediumOfInstruction,
    videos: preferences.videos,
    hasEquations: preferences.hasEquations,
  });

  return { engineeredMessages };
}
