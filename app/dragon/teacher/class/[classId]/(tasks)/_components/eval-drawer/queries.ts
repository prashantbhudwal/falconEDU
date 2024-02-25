"use server";
import { testPreferences as testPreferencesTestData } from "@/lib/schema/test-data";
import {
  ChatContext,
  isEmptyObject,
} from "@/app/dragon/ai/student-chat/prompts/chat/queries";
import {
  StudentPreferenceSchema,
  botPreferencesSchema,
  lessonPreferencesSchema,
  teacherPreferencesSchema,
  testBotPreferencesSchema,
} from "@/lib/schema";
import prisma from "@/prisma";
import { cache } from "react";
import * as z from "zod";

const testStudentPreferences: z.infer<typeof StudentPreferenceSchema> = {
  aboutYourself: "I am a student.",
  interests: "I love football.",
  favoriteCartoons: "Spongebob Squarepants",
  favoriteFoods: "Pizza",
};
const testStudentName = "Student";

export const getChatContextByConfigId = cache(async function ({
  configId,
}: {
  configId: string;
}): Promise<ChatContext> {
  console.log("getChatContextByConfigId");

  const context = await prisma.botConfig.findUnique({
    where: { id: configId },
    select: {
      name: true,
      preferences: true,
      Class: true,
      teacher: {
        select: {
          preferences: true,
          User: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  console.log("context", context);
  const Class = context?.Class;

  if (!Class) {
    throw new Error(`Class not found for configId ${configId}`);
  }

  const grade = Class.grade;

  if (!context) {
    throw new Error(`BotConfig not found for configId ${configId}`);
  }

  console.log("context", context);
  let botPreferences = context?.preferences;
  let teacherPreferences = context?.teacher?.preferences;
  let studentPreferences = testStudentPreferences;

  // Add default values for preferences and then parse them when empty

  const parsedBotPreferences = isEmptyObject(botPreferences)
    ? { success: true, data: {} }
    : botPreferencesSchema.safeParse(botPreferences);
  const parsedTeacherPreferences = isEmptyObject(teacherPreferences)
    ? { success: true, data: {} }
    : teacherPreferencesSchema.safeParse(teacherPreferences);
  const parsedStudentPreferences = isEmptyObject(studentPreferences)
    ? { success: true, data: {} }
    : StudentPreferenceSchema.safeParse(studentPreferences);

  console.log("parsedBotPreferences", parsedBotPreferences);
  console.log("parsedTeacherPreferences", parsedTeacherPreferences);
  console.log("parsedStudentPreferences", parsedStudentPreferences);

  if (
    parsedBotPreferences.success &&
    parsedTeacherPreferences.success &&
    parsedStudentPreferences.success
  ) {
    const flatContext = {
      teacherName: context?.teacher?.User?.name,
      studentName: testStudentName,
      botPreferences: parsedBotPreferences.data,
      teacherPreferences: parsedTeacherPreferences.data,
      studentPreferences: parsedStudentPreferences.data,
      name: context.name,
      grade,
    };
    console.log("flatContext", flatContext);
    return flatContext;
  } else {
    console.error("Validation failed:");
    return null;
  }
});

export const getTestQuestionsByBotConfigId = cache(async function ({
  configId,
}: {
  configId: string;
}) {
  const context = await prisma.botConfig.findUnique({
    where: { id: configId },
    select: {
      parsedQuestions: true,
      preferences: true,
    },
  });

  if (!context) {
    console.error(`BotConfig not found for configId ${configId}`);
  }

  let testQuestions = context?.parsedQuestions;

  let preferences = context?.preferences as z.infer<
    typeof testBotPreferencesSchema
  >;

  if (isEmptyObject(preferences) || preferences === undefined) {
    preferences = testPreferencesTestData[0];
  }

  return { testQuestions, preferences };
});

export const getLessonContextByConfigId = cache(async function ({
  configId,
}: {
  configId: string;
}) {
  const context = await prisma.botConfig.findUnique({
    where: { id: configId },
    select: {
      preferences: true,
      Class: true,
      teacher: {
        select: {
          preferences: true,
          User: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
  console.log("context", context);

  if (!context) {
    console.error(`BotConfig not found for configId ${configId}`);
  }

  const Class = context?.Class;

  if (!Class) {
    throw new Error(`Class not found for configId ${configId}`);
  }

  const grade = Class.grade;

  let lessonPreferences = context?.preferences;
  let teacherPreferences = context?.teacher?.preferences;
  let studentPreferences = testStudentPreferences;

  // Add default values for preferences and then parse them when empty

  const parsedLessonPreferences = isEmptyObject(lessonPreferences)
    ? { success: true, data: {} }
    : lessonPreferencesSchema.safeParse(lessonPreferences);
  const parsedTeacherPreferences = isEmptyObject(teacherPreferences)
    ? { success: true, data: {} }
    : teacherPreferencesSchema.safeParse(teacherPreferences);
  const parsedStudentPreferences = isEmptyObject(studentPreferences)
    ? { success: true, data: {} }
    : StudentPreferenceSchema.safeParse(studentPreferences);

  if (
    parsedLessonPreferences.success &&
    parsedTeacherPreferences.success &&
    parsedStudentPreferences.success
  ) {
    const flatContext = {
      teacherName: context?.teacher?.User?.name,
      studentName: testStudentName,
      lessonPreferences: parsedLessonPreferences.data,
      teacherPreferences: parsedTeacherPreferences.data,
      studentPreferences: parsedStudentPreferences.data,
      grade,
    };
    return flatContext;
  } else {
    console.error("Validation failed:");
    return null;
  }
});

export const getAITestContextByConfigId = cache(async function ({
  configId,
}: {
  configId: string;
}) {
  const context = await prisma.botConfig.findUnique({
    where: { id: configId },
    select: {
      preferences: true,
      Class: true,
      teacher: {
        select: {
          preferences: true,
          User: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!context) {
    console.error(`BotConfig not found for configId ${configId}`);
  }

  const Class = context?.Class;

  if (!Class) {
    throw new Error(`Class not found for configId ${configId}`);
  }

  const grade = Class.grade;

  let lessonPreferences = context?.preferences;
  let teacherPreferences = context?.teacher?.preferences;
  let studentPreferences = testStudentPreferences;

  // Add default values for preferences and then parse them when empty

  const parsedLessonPreferences = isEmptyObject(lessonPreferences)
    ? { success: true, data: {} }
    : lessonPreferencesSchema.safeParse(lessonPreferences);
  const parsedTeacherPreferences = isEmptyObject(teacherPreferences)
    ? { success: true, data: {} }
    : teacherPreferencesSchema.safeParse(teacherPreferences);
  const parsedStudentPreferences = isEmptyObject(studentPreferences)
    ? { success: true, data: {} }
    : StudentPreferenceSchema.safeParse(studentPreferences);

  if (
    parsedLessonPreferences.success &&
    parsedTeacherPreferences.success &&
    parsedStudentPreferences.success
  ) {
    const flatContext = {
      teacherName: context?.teacher?.User?.name,
      studentName: testStudentName,
      lessonPreferences: parsedLessonPreferences.data,
      teacherPreferences: parsedTeacherPreferences.data,
      studentPreferences: parsedStudentPreferences.data,
      grade,
    };
    return flatContext;
  } else {
    console.error("Validation failed:");
    return null;
  }
});
