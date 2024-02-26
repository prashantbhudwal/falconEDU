import { getEngineeredMessagesForLesson } from "./template";
import { getFormattedGrade } from "@/app/dragon/teacher/utils";
import { LessonContext } from "@/lib/routers/contextRouter/queries";

export async function getEngineeredLessonBotMessages(context: LessonContext) {
  const {
    studentName,
    lessonPreferences,
    studentPreferences,
    teacherPreferences,
  } = context;
  const { subjects } = lessonPreferences;
  const unformattedGrade = context?.grade;
  const grade = unformattedGrade
    ? getFormattedGrade({ grade: unformattedGrade })
    : "Grade 5";
  const stringifiedSubjects = JSON.stringify(subjects);

  const engineeredMessages = getEngineeredMessagesForLesson({
    aboutYourself: studentPreferences.aboutYourself,
    favoriteCartoons: studentPreferences.favoriteCartoons,
    favoriteFoods: studentPreferences.favoriteFoods,
    grade: grade,
    humorLevel: lessonPreferences.humorLevel,
    interests: studentPreferences.interests,
    language: lessonPreferences.language,
    languageProficiency: lessonPreferences.languageProficiency,
    likes: teacherPreferences.likes,
    dislikes: teacherPreferences.dislikes,
    personalInformation: teacherPreferences.personalInformation,
    professionalInformation: teacherPreferences.professionalInformation,
    studentName: studentName,
    subjects: stringifiedSubjects,
    teacherName: context.teacherName,
    topic: lessonPreferences.topic,
    tone: lessonPreferences.tone,
    content: lessonPreferences.content,
    mediumOfInstruction: lessonPreferences.mediumOfInstruction,
    videos: lessonPreferences.videos,
    hasEquations: lessonPreferences.hasEquations,
  });

  return { engineeredMessages };
}
