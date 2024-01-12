import { messageTemplates } from "./lesson-template";
import { ChatPromptTemplate } from "langchain/prompts";
import {
  lessonPreferences as lessonPreferencesTest,
  teacherPreferences as teacherPreferencesTest,
  studentPreferences as studentPreferencesTest,
} from "../../../../test-data";
import { LessonContextByChatId } from "./queries";
import { isEmptyObject } from "../chat-prompts/queries";
import {
  lessonPreferencesSchema,
  teacherPreferencesSchema,
  StudentPreferenceSchema,
} from "../../../../schema";
import * as z from "zod";
import { getFormattedGrade } from "@/app/dragon/teacher/utils";

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
  } as const;
  return preferences;
};

export async function getEngineeredLessonBotMessages(
  context: LessonContextByChatId
) {
  if (!context) {
    console.error("context not found for chatId:");
  }
  const mergedSchema = lessonPreferencesSchema.merge(teacherPreferencesSchema);
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
