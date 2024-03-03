import { getEngineeredMessages } from "./template";
import { getFormattedGrade } from "@/lib/helpers";
import { AITestContext } from "@/lib/routers/contextRouter/queries";

export async function getEngineeredAITestBotMessages(context: AITestContext) {
  const { studentName, lessonPreferences, studentPreferences } = context;
  const { subjects } = lessonPreferences;
  const unformattedGrade = context?.grade;
  const grade = unformattedGrade
    ? getFormattedGrade({ grade: unformattedGrade })
    : "Grade %";
  const stringifiedSubjects = JSON.stringify(subjects);
  const engineeredMessages = getEngineeredMessages({
    studentName: studentName,
    grade: grade,
    aboutYourself: studentPreferences.aboutYourself,
    favoriteCartoons: studentPreferences.favoriteCartoons,
    favoriteFoods: studentPreferences.favoriteFoods,
    interests: studentPreferences.interests,
    topic: lessonPreferences.topic,
    subjects: stringifiedSubjects,
    content: lessonPreferences.content,
    mediumOfInstruction: lessonPreferences.mediumOfInstruction,
    hasEquations: lessonPreferences.hasEquations,
  });
  return { engineeredMessages };
}
