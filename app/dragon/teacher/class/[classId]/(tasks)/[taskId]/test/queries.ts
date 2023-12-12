import prisma from "@/prisma";
import { cache } from "react";
export const revalidate = 3600; // 1 h
import { type Message } from "ai/react";
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export const getStudentsByBotConfigId = cache(async function (
  botConfigId: string
) {
  const isPublished = await prisma.botConfig.findUnique({
    where: { id: botConfigId },
    select: {
      published: true,
    },
  });
  if (!isPublished?.published) {
    return {
      students: [],
      isPublished: false,
    };
  }

  const bots = await prisma.bot.findMany({
    where: { botConfigId },
    select: {
      id: true,
      isSubmitted: true,
      isChecked: true,
      isActive: true,
      student: {
        select: {
          User: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  });

  if (bots.length === 0) {
    return {
      students: [],
      isPublished: false,
    };
  }

  const students = bots.map((bot) => ({
    studentBotId: bot.id,
    name: bot.student.User.name,
    email: bot.student.User.email,
    image: bot.student.User.image,
    isSubmitted: bot.isSubmitted,
    isChecked: bot.isChecked,
    isActive: bot.isActive,
  }));

  return {
    students,
    isPublished: true,
  };
});

export type StudentsByBotConfigId = UnwrapPromise<
  ReturnType<typeof getStudentsByBotConfigId>
>;

export const getSingleStudentByStudentBotId = cache(async function (
  botConfigId: string
) {
  const bot = await prisma.bot.findUnique({
    where: { id: botConfigId },
    select: {
      id: true,
      isSubmitted: true,
      isChecked: true,
      isActive: true,
      student: {
        select: {
          User: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  });

  return bot || null;
});

export const getDefaultChatMessagesByStudentBotId = cache(async function (
  studentBotId: string
): Promise<{ messages: Message[]; id: string; userImage: string }> {
  const defaultChat = await prisma.botChat.findFirst({
    where: {
      botId: studentBotId,
      isDefault: true,
    },
    select: {
      messages: true,
      id: true,
      bot: {
        select: {
          student: {
            select: {
              User: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      },
    },
  });
  const image = defaultChat?.bot?.student?.User?.image;

  if (!defaultChat || !defaultChat.messages) {
    throw new Error(`Default chat not found for studentBotId ${studentBotId}`);
  }

  if (typeof defaultChat.messages === "string") {
    const parsedMessages = JSON.parse(defaultChat.messages);
    if (!Array.isArray(parsedMessages)) {
      throw new Error("Parsed messages are not an array");
    }
    return {
      messages: parsedMessages,
      id: defaultChat?.id,
      userImage: image ?? "",
    };
  } else {
    return { messages: [], id: defaultChat?.id, userImage: "" };
  }
});

export const getUserImageByStudentBotId = async function (
  studentBotId: string
): Promise<string | null> {
  const bot = await prisma.bot.findUnique({
    where: { id: studentBotId },
    select: {
      student: {
        select: {
          User: {
            select: {
              image: true,
            },
          },
        },
      },
    },
  });

  if (!bot || !bot.student || !bot.student.User) {
    throw new Error(`User not found for studentBotId ${studentBotId}`);
  }

  return bot.student.User.image;
};

export const getAllQuestionResponsesByBotConfigId = cache(
  async (botConfigId: string) => {
    try {
      const isPublished = await prisma.botConfig.findUnique({
        where: { id: botConfigId },
        select: {
          published: true,
        },
      });
      if (!isPublished?.published) {
        return {
          students: [],
          isPublished: false,
        };
      }

      const bots = await prisma.bot.findMany({
        where: { botConfigId },
        select: {
          id: true,
          isSubmitted: true,
          BotChat: {
            select: {
              BotChatQuestions: {
                select: {
                  isCorrect: true,
                  parsedQuestionsId: true,
                  botChatId: true,
                  student_answer: true,
                  id: true,
                  score: true,
                  feedback: true,
                },
              },
            },
          },
        },
      });

      if (bots.length === 0) {
        return {
          students: [],
          isPublished: false,
        };
      }

      const submittedBots = bots.filter((bot) => bot.isSubmitted);

      const studentResponses = submittedBots.map((response) => {
        return {
          id: response.id,
          BotChatQuestions: response.BotChat[0].BotChatQuestions,
        };
      });

      return studentResponses;
    } catch (err) {
      return null;
    }
  }
);
export type AllStudentResponsesByBotConfigId = UnwrapPromise<
  ReturnType<typeof getAllQuestionResponsesByBotConfigId>
>;
