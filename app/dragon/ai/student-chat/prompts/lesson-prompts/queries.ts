import prisma from "@/prisma";
import { cache } from "react";
import { type UnwrapPromise } from "../../../../student/queries";
import * as z from "zod";
import {
  lessonPreferencesSchema,
  teacherPreferencesSchema,
  StudentPreferenceSchema,
} from "@/app/dragon/schema";
import { isEmptyObject } from "../chat-prompts/queries";

export const getLessonContextByChatId = cache(async function (chatId: string) {
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

  const test = await prisma.bot.findMany({
    where: {
      BotChat: {
        some: {
          id: chatId,
        },
      },
    },
  });
  //console.log("test", test);

  // console.log("context", context);
  if (!context) {
    console.error("context not found for chatId:", chatId);
  }

  let lessonPreferences = context?.bot?.BotConfig?.preferences;
  let teacherPreferences = context?.bot?.BotConfig?.teacher?.preferences;
  let studentPreferences = context?.bot?.student?.preferences;

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
      teacherName: context?.bot?.BotConfig?.teacher?.User?.name,
      studentName: context?.bot.student.User.name,
      lessonPreferences: parsedLessonPreferences.data,
      teacherPreferences: parsedTeacherPreferences.data,
      studentPreferences: parsedStudentPreferences.data,
    };
    return flatContext;
  } else {
    console.error("Validation failed:");
    return null;
  }
});
export type LessonContextByChatId = UnwrapPromise<
  ReturnType<typeof getLessonContextByChatId>
>;
