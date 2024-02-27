"use server";
// TODO the interface for each task should be of the same type to make it easier to work with

import prisma from "@/prisma";
import { cache } from "react";
import {
  AITestPreferenceSchema,
  StudentPreferenceSchema,
  teacherPreferencesSchema,
  botPreferencesSchema,
  lessonPreferencesSchema,
  testBotPreferencesSchema,
  defaultValues,
} from "@/lib/schema";
import { z } from "zod";
import { UnwrapPromise, isEmptyObject } from "../helpers";

import { TaskType } from "@/types";
import { Grade } from "@prisma/client";

const schemaMap = {
  "ai-test": AITestPreferenceSchema,
  lesson: lessonPreferencesSchema,
  test: testBotPreferencesSchema,
  chat: botPreferencesSchema,
};
type SchemaMapOutputTypes = {
  [K in TaskType]: z.infer<(typeof schemaMap)[K]>;
};

function parsePreferences<T>(
  schema: z.ZodSchema<any>,
  preferences: any,
  defaultData: T,
) {
  return isEmptyObject(preferences)
    ? { success: true, data: defaultData }
    : schema.safeParse(preferences);
}

type ContextReturnType<T extends TaskType> = Promise<{
  teacherName: string | null;
  studentName: string | null;
  taskPreferences: SchemaMapOutputTypes[T];
  teacherPreferences: z.infer<typeof teacherPreferencesSchema>;
  studentPreferences: z.infer<typeof StudentPreferenceSchema>;
  name: string;
  grade: Grade;
}>;

const getContextByChatId = cache(async function <T extends TaskType>(
  chatId: string,
  taskType: T,
): ContextReturnType<T> {
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
          },
        },
      },
    },
  });

  const Class = context?.bot?.BotConfig?.Class;

  if (!Class) {
    throw new Error(`Class not found for chatId ${chatId}`);
  }

  const grade = Class.grade;

  const taskPreferences = context?.bot?.BotConfig?.preferences;
  const teacherPreferences = context?.bot?.BotConfig?.teacher?.preferences;
  const studentPreferences = context?.bot?.student?.preferences;

  const parsedTaskPreferences = parsePreferences(
    schemaMap[taskType],
    taskPreferences,
    defaultValues.tasks[taskType],
  );
  const parsedTeacherPreferences = parsePreferences(
    teacherPreferencesSchema,
    teacherPreferences,
    defaultValues.preferences.teacherPreferences,
  );
  const parsedStudentPreferences = parsePreferences(
    StudentPreferenceSchema,
    studentPreferences,
    defaultValues.preferences.studentPreferences,
  );

  if (
    parsedTaskPreferences.success &&
    parsedTeacherPreferences.success &&
    parsedStudentPreferences.success
  ) {
    const flatContext = {
      teacherName: context?.bot?.BotConfig?.teacher?.User?.name,
      studentName: context?.bot.student.User.name,
      taskPreferences: parsedTaskPreferences.data as SchemaMapOutputTypes[T],
      teacherPreferences: parsedTeacherPreferences.data,
      studentPreferences: parsedStudentPreferences.data,
      name: context?.bot?.BotConfig?.name,
      grade,
    };
    return flatContext;
  } else {
    throw new Error("Validation failed");
  }
});

const getContextByConfigId = cache(async function <T extends TaskType>(
  configId: string,
  taskType: T,
): ContextReturnType<T> {
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

  const Class = context?.Class;

  if (!Class) {
    throw new Error(`Class not found for ${configId}`);
  }

  const grade = Class.grade;

  const taskPreferences = context?.preferences;
  const teacherPreferences = context?.teacher?.preferences;
  const studentPreferences = defaultValues.preferences.studentPreferences;

  const parsedTaskPreferences = parsePreferences(
    schemaMap[taskType],
    taskPreferences,
    defaultValues.tasks[taskType],
  );
  const parsedTeacherPreferences = parsePreferences(
    teacherPreferencesSchema,
    teacherPreferences,
    defaultValues.preferences.teacherPreferences,
  );
  const parsedStudentPreferences = parsePreferences(
    StudentPreferenceSchema,
    studentPreferences,
    defaultValues.preferences.studentPreferences,
  );

  if (
    parsedTaskPreferences.success &&
    parsedTeacherPreferences.success &&
    parsedStudentPreferences.success
  ) {
    const flatContext = {
      teacherName: context?.teacher?.User?.name,
      studentName: "Test Student",
      taskPreferences: parsedTaskPreferences.data as SchemaMapOutputTypes[T],
      teacherPreferences: parsedTeacherPreferences.data,
      studentPreferences: parsedStudentPreferences.data,
      name: context?.name,
      grade,
    };

    return flatContext;
  } else {
    throw new Error("Validation failed");
  }
});

// ------------------------------

const getContext = cache(async function <T extends TaskType>(
  { chatId, configId }: { chatId?: string; configId?: string },
  taskType: T,
): ContextReturnType<T> {
  if (chatId) {
    return await getContextByChatId(chatId, taskType);
  } else if (configId) {
    return await getContextByConfigId(configId, taskType);
  } else {
    throw new Error("Either chatId or botConfigId must be provided");
  }
});

export const aiTest = cache(async function ({
  chatId,
  configId,
}: {
  chatId?: string;
  configId?: string;
}) {
  const taskType: TaskType = "ai-test";
  const context = await getContext({ chatId, configId }, taskType);
  const { taskPreferences, ...rest } = context;
  const flatContext = {
    lessonPreferences: taskPreferences,
    ...rest,
  };
  return flatContext;
});
export type AITestContext = UnwrapPromise<ReturnType<typeof aiTest>>;

// ------------------------------
export const chat = cache(async function ({
  chatId,
  configId,
}: {
  chatId?: string;
  configId?: string;
}) {
  const taskType: TaskType = "chat";
  const context = await getContext({ chatId, configId }, taskType);
  const { taskPreferences, ...rest } = context;
  const flatContext = {
    botPreferences: taskPreferences,
    ...rest,
  };
  return flatContext;
});
export type ChatContext = UnwrapPromise<ReturnType<typeof chat>>;

// ------------------------------

export const lesson = cache(async function ({
  chatId,
  configId,
}: {
  chatId?: string;
  configId?: string;
}) {
  const taskType: TaskType = "lesson";
  const context = await getContext({ chatId, configId }, taskType);
  const { taskPreferences, ...rest } = context;
  const flatContext = {
    lessonPreferences: taskPreferences,
    ...rest,
  };
  return flatContext;
});
export type LessonContext = UnwrapPromise<ReturnType<typeof lesson>>;

// ------------------------------

const getTestContextByChatId = cache(async function (chatId: string) {
  const context = await prisma.botChat.findUnique({
    where: { id: chatId },
    select: {
      bot: {
        select: {
          BotConfig: {
            select: {
              preferences: true,
              parsedQuestions: true,
            },
          },
        },
      },
    },
  });

  if (!context) {
    console.error("context not found for chatId:", chatId);
  }

  let testQuestions = context?.bot?.BotConfig?.parsedQuestions;

  let preferences = context?.bot?.BotConfig?.preferences as z.infer<
    typeof testBotPreferencesSchema
  >;

  if (isEmptyObject(preferences) || preferences === undefined) {
    preferences = defaultValues.tasks.test;
  }

  return { testQuestions, preferences };
});

const getTestContextByConfigId = cache(async function (chatId: string) {
  const context = await prisma.botConfig.findUnique({
    where: { id: chatId },
    select: {
      preferences: true,
      parsedQuestions: true,
    },
  });

  if (!context) {
    console.error(`BotConfig not found for configId ${chatId}`);
  }

  let testQuestions = context?.parsedQuestions;

  let preferences = context?.preferences as z.infer<
    typeof testBotPreferencesSchema
  >;

  if (isEmptyObject(preferences) || preferences === undefined) {
    preferences = defaultValues.tasks.test;
  }

  return { testQuestions, preferences };
});

const getTestContext = cache(async function ({
  chatId,
  configId,
}: {
  chatId?: string;
  configId?: string;
}) {
  if (chatId) {
    return await getTestContextByChatId(chatId);
  } else if (configId) {
    return await getTestContextByConfigId(configId);
  } else {
    throw new Error("Either chatId or botConfigId must be provided");
  }
});

export const test = cache(async function ({
  chatId,
  configId,
}: {
  chatId?: string;
  configId?: string;
}) {
  const context = await getTestContext({ chatId, configId });
  const { testQuestions, preferences } = context;
  return { testQuestions, preferences };
});

export type TestContext = UnwrapPromise<ReturnType<typeof test>>;

export type Contexts =
  | LessonContext
  | ChatContext
  | AITestContext
  | TestContext;

export type TaskContextMap = {
  chat: ChatContext;
  test: TestContext;
  lesson: LessonContext;
  "ai-test": AITestContext;
};
