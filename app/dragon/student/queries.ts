"use server";
import prisma from "@/prisma";
import { cache } from "react";
import * as z from "zod";
import {
  botPreferencesSchema,
  teacherPreferencesSchema,
  StudentPreferenceSchema,
} from "../schema";

export const getStudentId = cache(async function (userId: string) {
  const studentProfile = await prisma.studentProfile.findFirst({
    where: { userId },
    select: { id: true },
  });

  return studentProfile?.id;
});

export const getBotsByUserId = cache(async function (userId: string) {
  const studentId = await getStudentId(userId);
  if (!studentId) {
    console.error(`StudentProfile with userId ${userId} not found`);
  }
  const bots = await prisma.bot.findMany({
    where: { studentId },
    select: {
      id: true,
      name: true,
      BotConfig: {
        select: {
          name: true,
          teacher: {
            select: {
              User: {
                select: {
                  image: true,
                },
              },
            },
          },
        },
      },
    },
  });
  return bots;
});

export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export type BotsByUserId = UnwrapPromise<ReturnType<typeof getBotsByUserId>>;
export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export const getChatsByBotId = cache(async function (botId: string) {
  const chats = await prisma.botChat.findMany({
    where: {
      botId,
    },
    include: {
      bot: {
        include: {
          BotConfig: true,
        },
      },
    },
  });
  return chats;
});
export type ChatsByBotId = UnwrapPromise<ReturnType<typeof getChatsByBotId>>;

export const getBotConfigByChatId = cache(async function (chatId: string) {
  const botChat = await prisma.botChat.findUnique({
    where: { id: chatId },
    select: {
      bot: {
        select: {
          BotConfig: true,
        },
      },
    },
  });

  const botConfig = botChat?.bot?.BotConfig;

  if (!botConfig) {
    console.error("BotConfig not found for chatId:", chatId);
  }

  return botConfig;
});
export type BotConfigByChatId = UnwrapPromise<
  ReturnType<typeof getBotConfigByChatId>
>;

export const getBotChatByChatId = cache(async function (chatId: string) {
  const botChat = await prisma.botChat.findUnique({
    where: { id: chatId },
    select: {
      messages: true,
      isRead: true,
      id: true,
      isSubmitted: true,
      bot: {
        select: {
          BotConfig: {
            select: {
              teacher: {
                select: {
                  User: {
                    select: {
                      image: true,
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
  let botImage = botChat?.bot?.BotConfig?.teacher?.User?.image;
  if (!botImage) {
    botImage = "/chubbi.png";
  }

  if (!botChat || !botChat.messages) {
    console.error("BotChat not found for chatId:", chatId);
    return null;
  }
  let messagesArray = [];
  if (typeof botChat.messages === "string") {
    messagesArray = JSON.parse(botChat.messages);
  }
  return {
    botImage,
    messages: messagesArray,
    isRead: botChat.isRead,
    botChatId: botChat.id,
    isSubmitted: botChat.isSubmitted,
  };
});

export type BotChatByChatId = UnwrapPromise<
  ReturnType<typeof getBotChatByChatId>
>;

export const getBotByBotId = cache(async function (botId: string) {
  const bot = await prisma.bot.findUnique({
    where: { id: botId },
    select: {
      id: true,
      name: true,
      isActive: true,
      isSubmitted: true,
      BotChat: true,
      BotConfig: {
        select: {
          id: true,
          name: true,
          type: true,
          isActive: true,
          published: true,
          teacherId: true,
          timeLimit: true,
          canReAttempt: true,
          teacher: {
            select: {
              User: {
                select: {
                  image: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });
  return bot;
});

export type GetBotByBotId = UnwrapPromise<ReturnType<typeof getBotByBotId>>;

export const getTeachersByUserId = cache(async function (userId: string) {
  const userData = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      StudentProfile: {
        select: {
          bot: {
            select: {
              BotConfig: {
                select: {
                  teacher: {
                    select: {
                      id: true,
                      User: {
                        select: {
                          name: true,
                          image: true,
                          email: true, // Add more fields as you need
                        },
                      },
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

  const teachers: any[] = [];
  const teacherIds = new Set<string>();

  userData?.StudentProfile?.bot?.forEach((bot) => {
    const teacher = bot.BotConfig.teacher;
    if (teacher && teacher.User && !teacherIds.has(teacher.id)) {
      teacherIds.add(teacher.id);
      teachers.push({ id: teacher.id, ...teacher.User });
    }
  });

  return teachers;
});
export type GetTeachersByUserId = UnwrapPromise<
  ReturnType<typeof getTeachersByUserId>
>;

export const getDefaultChatReadStatus = async function (botId: string) {
  const readStatus = await prisma.botChat.findFirst({
    where: {
      botId: botId,
      isDefault: true,
    },
    select: {
      id: true,
      isRead: true,
    },
  });
  if (!readStatus) throw new Error("No default chat found");
  return { isRead: readStatus?.isRead };
};

export const getClassByBotId = async function ({ botId }: { botId: string }) {
  try {
    const response = await prisma.bot.findUnique({
      where: { id: botId },
      select: {
        BotConfig: {
          select: {
            Class: true,
          },
        },
      },
    });
    if (response?.BotConfig.Class) {
      return response.BotConfig.Class;
    }
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export type GetClassByBotId = UnwrapPromise<ReturnType<typeof getClassByBotId>>;
