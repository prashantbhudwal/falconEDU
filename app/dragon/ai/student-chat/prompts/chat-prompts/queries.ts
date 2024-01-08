"use server";
import prisma from "@/prisma";
import { cache } from "react";
import { type UnwrapPromise } from "../../../../student/queries";
import * as z from "zod";
import {
  botPreferencesSchema,
  teacherPreferencesSchema,
  StudentPreferenceSchema,
  testBotPreferencesSchema,
} from "@/app/dragon/schema";
export const isEmptyObject = (obj: any) => Object.keys(obj).length === 0;

export const getChatContextByChatId = cache(async function (chatId: string) {
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

  let botPreferences = context?.bot?.BotConfig?.preferences;
  let teacherPreferences = context?.bot?.BotConfig?.teacher?.preferences;
  let studentPreferences = context?.bot?.student?.preferences;

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

  if (
    parsedBotPreferences.success &&
    parsedTeacherPreferences.success &&
    parsedStudentPreferences.success
  ) {
    const flatContext = {
      teacherName: context?.bot?.BotConfig?.teacher?.User?.name,
      studentName: context?.bot.student.User.name,
      botPreferences: parsedBotPreferences.data,
      teacherPreferences: parsedTeacherPreferences.data,
      studentPreferences: parsedStudentPreferences.data,
      name: context?.bot?.BotConfig?.name,
    };
    return flatContext;
  } else {
    console.error("Validation failed:");
    return null;
  }
});
export type ChatContextByChatId = UnwrapPromise<
  ReturnType<typeof getChatContextByChatId>
>;
export async function getBotConfigTypeByBotChatId(botChatId: string) {
  const botChat = await prisma.botChat.findUnique({
    where: { id: botChatId },
    select: {
      bot: {
        select: {
          BotConfig: {
            select: {
              type: true,
            },
          },
        },
      },
    },
  });

  return botChat?.bot?.BotConfig?.type;
}
