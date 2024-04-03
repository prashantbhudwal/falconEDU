/**
 * TODO: Complete the implementation of getTaskPreferences
 * - Learn Generics and then refactor the code to use Generics
 * - One preference router should be able to handle all types of preferences
 * - And all preferences returned should be properly typed depending on the type of preference
 */

"use server";
import prisma from "@/prisma";
import { TaskType } from "@/types";
import { cache } from "react";
import {
  StudentPreferenceSchema,
  lessonPreferencesSchema,
  teacherPreferencesSchema,
} from "@/lib/schema";
import { z } from "zod";

export const test = "test";

/**
 *  ❌ **CAUTION:**  _WORK IN PROGRESS - NOT READY FOR USE_
 */
export function getTaskPreferences({
  type,
  chatId,
}: {
  type: TaskType;
  chatId: string;
}) {
  switch (type) {
    case "chat": {
      return getChatPreferences(chatId);
    }
    case "test": {
      return getTestPreferences(chatId);
    }
    case "lesson": {
      return getLessonPreferences(chatId);
    }
    case "ai-test": {
      return getAITestPreferences(chatId);
    }
    default:
      throw new Error("Invalid type");
  }
}

function parsePreferences<T>(schema: z.ZodSchema<T>, preferences: any): T {
  // Directly return an empty object if preferences are empty
  if (Object.keys(preferences).length === 0) {
    return {} as T;
  }

  // Proceed with schema validation for non-empty preferences
  const parseResult = schema.safeParse(preferences);
  if (parseResult.success) {
    return parseResult.data;
  } else {
    console.error("Validation failed", parseResult.error);
    // Consider how to handle validation failures; returning an empty object for now
    return {} as T;
  }
}

export const getLessonPreferences = cache(async function (chatId: string) {
  const context = await prisma.botChat.findUnique({
    where: { id: chatId },
    select: {
      bot: {
        select: {
          student: {
            select: {
              preferences: true,
              User: {
                select: {
                  name: true,
                },
              },
            },
          },
          BotConfig: {
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
          },
        },
      },
    },
  });

  if (!context) throw new Error(`Context not found for chatId ${chatId}`);
  const Class = context?.bot?.BotConfig?.Class;
  if (!Class) throw new Error(`Class not found for chatId ${chatId}`);
  const grade = Class.grade;

  let configPreferences = context?.bot?.BotConfig?.preferences;
  let teacherPreferences = context?.bot?.BotConfig?.teacher?.preferences;
  let studentPreferences = context?.bot?.student?.preferences;

  const parsedLessonPreferences = parsePreferences(
    lessonPreferencesSchema,
    configPreferences,
  );
  const parsedTeacherPreferences = parsePreferences(
    teacherPreferencesSchema,
    teacherPreferences,
  );
  const parsedStudentPreferences = parsePreferences(
    StudentPreferenceSchema,
    studentPreferences,
  );

  return {
    teacherName: context?.bot?.BotConfig?.teacher?.User?.name,
    studentName: context?.bot?.student?.User?.name,
    lessonPreferences: parsedLessonPreferences,
    teacherPreferences: parsedTeacherPreferences,
    studentPreferences: parsedStudentPreferences,
    grade: Class.grade,
  };
});

// dummy function to be replaced with actual implementation
export const getChatPreferences = async function (chatId: string) {
  return {};
};

// dummy function to be replaced with actual implementation
export const getTestPreferences = async function (chatId: string) {
  return {};
};

// dummy function to be replaced with actual implementation
export const getAITestPreferences = async function (chatId: string) {
  return {};
};
