"use server";
import { getBotsURL, getTaskUrl, getTeacherHomeURL } from "@/lib/urls";
import { isAuthorized } from "@/lib/utils";
import prisma from "@/prisma";
import { revalidatePath } from "next/cache";
import { cache } from "react";
import { TaskType } from "@/types/dragon";
import { getTaskProperties } from "../../helpers";
import { BotConfig } from "@prisma/client";
import { PublishResult } from "./publish.types";
import { ConfigTypeSchemaMap } from "./types";
export const getTaskStats = cache(
  async ({
    classId,
    taskId,
    taskType,
  }: {
    classId: string;
    taskId: string;
    taskType: TaskType;
  }) => {
    await isAuthorized({
      userType: "TEACHER",
    });
    try {
      const currentStudents = await prisma.class.findUnique({
        where: {
          id: classId,
        },
        select: {
          students: true,
        },
      });

      if (!currentStudents || currentStudents.students.length === 0) {
        return null;
      }

      const currentStudentsIds = currentStudents?.students.map(
        (student) => student.id,
      );

      const allBotsForTask = await prisma.botConfig.findUnique({
        where: {
          id: taskId,
          published: true,
        },
        select: {
          Bot: {
            select: {
              studentId: true,
              isSubmitted: true,
              BotChat: {
                where: {
                  isDefault: true,
                },
                select: {
                  messages: true,
                  isRead: true,
                },
              },
            },
          },
        },
      });

      if (!allBotsForTask || allBotsForTask.Bot.length === 0) {
        return null;
      }

      const botForCurrentStudents = allBotsForTask?.Bot.filter((bot) =>
        currentStudentsIds.includes(bot.studentId),
      );

      const totalInteractedStudents = botForCurrentStudents.filter((bot) => {
        return bot.BotChat[0].isRead;
        // const messagesArray =
        //   typeof bot.BotChat[0].messages === "string"
        //     ? JSON.parse(bot.BotChat[0].messages)
        //     : [];
        // return messagesArray.length >= 2;
      }).length;

      const totalNumberOfChatsArray = botForCurrentStudents.map((bot) => {
        const messagesArray =
          typeof bot.BotChat[0].messages === "string"
            ? JSON.parse(bot.BotChat[0].messages)
            : [];
        return Math.ceil(messagesArray.length / 2);
      });

      const total_number_of_chat_of_a_task = totalNumberOfChatsArray.reduce(
        (a, b) => a + b,
        0,
      );

      const chatCount =
        total_number_of_chat_of_a_task / currentStudents.students.length;

      const totalSubmittedStudents = botForCurrentStudents.filter(
        (bot) => bot.isSubmitted,
      ).length;

      const percentageOfStudentsInteracted =
        (totalInteractedStudents / currentStudents.students.length) * 100;

      return {
        totalCurrentStudents: currentStudents.students.length,
        totalInteractedStudents,
        percentageOfStudentsInteracted,
        totalSubmittedStudents:
          taskType === "test" ? totalSubmittedStudents : null,
        chatCount: Math.ceil(chatCount),
      };
    } catch (error) {
      console.error("Error getting task stats:", error);
      return null;
    }
  },
);

export const getTasksWithInteractions = cache(
  async ({ classId }: { classId: string }) => {
    try {
      const currentStudents = await prisma.class.findUnique({
        where: {
          id: classId,
        },
        select: {
          students: true,
        },
      });

      if (!currentStudents || currentStudents.students.length === 0) {
        return null;
      }

      const currentStudentsIds = currentStudents?.students.map(
        (student) => student.id,
      );

      const allTasks = await prisma.botConfig.findMany({
        where: { classId: classId, published: true },
        select: {
          name: true,
          id: true,
          type: true,
          Bot: {
            select: {
              studentId: true,
              isSubmitted: true,
              BotChat: {
                where: {
                  isDefault: true,
                },
                select: {
                  messages: true,
                  isRead: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const allTasksForCurrentStudents = allTasks.map((task) => {
        const filteredTasks = task.Bot.filter((bot) => {
          return currentStudentsIds.includes(bot.studentId);
        });

        return { ...task, Bot: filteredTasks };
      });

      const tasksWithInteractedStudentsCount = allTasksForCurrentStudents.map(
        (task) => {
          const totalInteractedStudents = task.Bot.filter((bot) => {
            // const messagesArray =
            //   typeof bot.BotChat[0].messages === "string"
            //     ? JSON.parse(bot.BotChat[0].messages)
            //     : [];
            // return messagesArray.length >= 2;
            return bot.BotChat[0].isRead;
          }).length;
          return {
            interactedStudents: totalInteractedStudents,
            totalStudents: currentStudents.students.length,
            task: task,
          };
        },
      );

      const sortedTasksWithInteractedStudentsCount =
        tasksWithInteractedStudentsCount.sort(
          (a, b) => a.interactedStudents - b.interactedStudents,
        );

      return sortedTasksWithInteractedStudentsCount;
    } catch (err) {
      console.error(err);
      return null;
    }
  },
);

export const publishBotConfig = async function ({
  classId,
  botConfigId,
  type,
}: {
  classId: string;
  botConfigId: string;
  type: TaskType;
}): Promise<PublishResult> {
  await isAuthorized({
    userType: "TEACHER",
  });
  try {
    //step 0: checking if botconfig is active or not
    const botConfig = await prisma.botConfig.findUnique({
      where: { id: botConfigId },
      select: {
        isActive: true,
        type: true,
      },
    });
    if (!botConfig) throw new Error(`BotConfig not found`);

    if (!botConfig.isActive) {
      return {
        success: false,
        message: `Can't Publish an Archived ${
          getTaskProperties(type).formattedType
        }`,
        updatedBotConfig: null,
      };
    }

    const transaction = await prisma.$transaction(async (prisma) => {
      // Step 1: Set published to true for BotConfig
      const updatedBotConfig = await prisma.botConfig.update({
        where: { id: botConfigId },
        data: { published: true },
      });
      if (!updatedBotConfig)
        throw new Error("BotConfig not found or update failed");

      // Step 2: Get class data and teacher's name
      const classData = await prisma.class.findUnique({
        where: { id: classId },
        include: {
          students: true,
          Teacher: {
            include: { User: true },
          },
        },
      });
      if (!classData) throw new Error("Class not found");

      const teacherName = classData.Teacher.User.name || "Unknown";

      // Step 3: Create Bots and BotChats for students if they don't exist
      for (const student of classData.students) {
        const existingBot = await prisma.bot.findFirst({
          where: {
            AND: [{ studentId: student.id }, { botConfigId }],
          },
        });

        if (!existingBot) {
          const newBot = await prisma.bot.create({
            data: {
              studentId: student.id,
              botConfigId,
              name: teacherName,
              BotChat: {
                create: {
                  isDefault: true,
                  messages: [],
                },
              },
            },
          });
          if (!newBot) throw new Error("Failed to create bot");
        }
      }
    });
    const updatedBotConfig = await prisma.botConfig.findUnique({
      where: { id: botConfigId },
    });

    revalidatePath("/dragon/teacher/class");

    return {
      success: true,
      updatedBotConfig,
      message: "Published Successfully",
    };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const unPublishBotConfig = async function ({
  classId,
  botConfigId,
  type,
}: {
  classId: string;
  botConfigId: string;
  type: TaskType;
}) {
  await isAuthorized({
    userType: "TEACHER",
  });
  try {
    //step 0: checking if botconfig is active or not
    const botConfig = await prisma.botConfig.findUnique({
      where: { id: botConfigId },
      select: {
        isActive: true,
        type: true,
      },
    });
    if (!botConfig) throw new Error(`BotConfig not found`);

    if (!botConfig.isActive) {
      return {
        success: false,
        message: `Can't Unpublish an Archived ${
          getTaskProperties(type).formattedType
        }`,
        updatedBotConfig: null,
      };
    }

    const updatedBotConfig = await prisma.botConfig.update({
      where: {
        id: botConfigId,
      },
      data: {
        published: false,
      },
      include: {
        Class: {
          where: { id: classId },
        },
      },
    });

    revalidatePath("/dragon/teacher/class");
    return {
      success: true,
      updatedBotConfig,
      message: "Unpublished Successfully",
    };
  } catch (error) {
    console.error("Error updating BotConfig:", error);
    throw error;
  }
};

export const createBotConfig = async function ({
  userId,
  classId,
  configName,
  configType,
}: {
  userId: string;
  classId: string;
  configName: string;
  configType: TaskType;
}) {
  await isAuthorized({
    userType: "TEACHER",
  });
  const teacherProfile = await prisma.teacherProfile.findUnique({
    where: { userId },
  });

  if (!teacherProfile) {
    throw new Error(`TeacherProfile with userId ${userId} not found`);
  }
  try {
    const botConfig = await prisma.botConfig.create({
      data: {
        teacherId: teacherProfile.id,
        classId,
        name: configName,
        type: configType.toLocaleLowerCase(),
      },
    });
    revalidatePath(getBotsURL(classId));
    return botConfig;
  } catch (error) {
    console.error("Error: ", error);
  }
};
export const updateBotConfig = async function ({
  classId,
  botId,
  data,
  configType,
}: {
  classId: string;
  botId: string;
  data: ConfigTypeSchemaMap[TaskType];
  configType: TaskType;
}): Promise<{ success: boolean; error?: any }> {
  await isAuthorized({
    userType: "TEACHER",
  });
  try {
    const result = await prisma.botConfig.update({
      where: { id: botId },
      data: {
        preferences: data,
      },
    });
    revalidatePath(getTaskUrl({ classId, taskId: botId, type: configType }));
    return { success: true };
  } catch (error) {
    console.error("Failed to update:", error);
    return { success: false, error };
  }
};

export const updateTaskConfig = async function ({
  classId,
  botId,
  data,
  configType,
}: {
  classId: string;
  botId: string;
  data: ConfigTypeSchemaMap[TaskType];
  configType: TaskType;
}): Promise<BotConfig> {
  await isAuthorized({
    userType: "TEACHER",
  });
  let result: BotConfig;
  try {
    result = await prisma.botConfig.update({
      where: { id: botId },
      data: { preferences: data },
    });
  } catch (error) {
    throw new Error("Failed to update");
  }
  revalidatePath(getTaskUrl({ classId, taskId: botId, type: configType }));
  return result;
};

export const updateBotConfigName = async function ({
  classId,
  botId,
  name,
}: {
  classId: string;
  botId: string;
  name: string;
}): Promise<{ success: boolean; error?: any }> {
  await isAuthorized({
    userType: "TEACHER",
  });
  try {
    const result = await prisma.botConfig.update({
      where: { id: botId },
      data: {
        name: name,
      },
    });
    revalidatePath(
      getTaskUrl({ classId, taskId: botId, type: result.type as TaskType }),
    );
    return { success: true };
  } catch (error) {
    console.error("Failed to update:", error);
    return { success: false, error };
  }
};

export const updateBotConfigDescription = async function ({
  classId,
  botId,
  description,
}: {
  classId: string;
  botId: string;
  description: string;
}): Promise<{ success: boolean; error?: any }> {
  await isAuthorized({
    userType: "TEACHER",
  });
  try {
    const result = await prisma.botConfig.update({
      where: { id: botId },
      data: {
        description: description,
      },
    });
    revalidatePath(
      getTaskUrl({ classId, taskId: botId, type: result.type as TaskType }),
    );
    return { success: true };
  } catch (error) {
    console.error("Failed to update:", error);
    return { success: false, error };
  }
};

export const getAllConfigsInClass = cache(
  async ({ userId, classId }: { userId: string; classId: string }) => {
    const organizeConfigs = (botConfigs: BOT_CONFIG_TYPE[]) => {
      const testConfigs = botConfigs.filter(
        (botConfig) => botConfig.type === "test",
      );
      const chatConfigs = botConfigs.filter(
        (botConfig) => botConfig.type === "chat",
      );

      const lessonConfigs = botConfigs.filter(
        (botConfig) => botConfig.type === "lesson",
      );

      const activeLessonConfigs = lessonConfigs
        .filter((botConfig) => botConfig.isActive)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      const archivedLessonConfigs = lessonConfigs
        .filter((botConfig) => !botConfig.isActive)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      const activeChatsConfigs = chatConfigs
        .filter((botConfig) => botConfig.isActive)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      const archivedChatsConfigs = chatConfigs
        .filter((botConfig) => !botConfig.isActive)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      const activeTestConfigs = testConfigs
        .filter((botConfig) => botConfig.isActive)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      const archivedTestConfigs = testConfigs
        .filter((botConfig) => !botConfig.isActive)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      const publishedLessonConfigs = lessonConfigs.filter(
        (botConfig) => botConfig.published,
      );
      const unPublishedLessonConfigs = lessonConfigs.filter(
        (botConfig) => !botConfig.published,
      );

      const publishedChatConfigs = chatConfigs.filter(
        (botConfig) => botConfig.published,
      );
      const unPublishedChatConfigs = chatConfigs.filter(
        (botConfig) => !botConfig.published,
      );
      const publishedTestConfigs = testConfigs.filter(
        (botConfig) => botConfig.published,
      );
      const unPublishedTestConfigs = testConfigs.filter(
        (botConfig) => !botConfig.published,
      );

      const configs = {
        all: botConfigs,
        active: botConfigs.filter((botConfig) => botConfig.isActive),
        archived: botConfigs.filter((botConfig) => !botConfig.isActive),
        chat: {
          all: chatConfigs,
          active: activeChatsConfigs,
          archived: archivedChatsConfigs,
          published: publishedChatConfigs,
          unpublished: unPublishedChatConfigs,
        },
        test: {
          all: testConfigs,
          active: activeTestConfigs,
          archived: archivedTestConfigs,
          published: publishedTestConfigs,
          unpublished: unPublishedTestConfigs,
        },
        lesson: {
          all: lessonConfigs,
          active: activeLessonConfigs,
          archived: archivedLessonConfigs,
          published: publishedLessonConfigs,
          unpublished: unPublishedLessonConfigs,
        },
      };
      return configs;
    };
    const teacherProfile = await prisma.teacherProfile.findUnique({
      where: { userId },
    });

    if (!teacherProfile) {
      throw new Error(`TeacherProfile with userId ${userId} not found`);
    }
    const botConfigs = await prisma.botConfig.findMany({
      where: {
        teacherId: teacherProfile.id,
        classId,
      },
      include: {
        Class: true,
      },
    });
    type BOT_CONFIG_TYPE = (typeof botConfigs)[0];
    const configs = organizeConfigs(botConfigs);
    return configs;
  },
);

export const getAllConfigs = cache(async ({ userId }: { userId: string }) => {
  const teacherProfile = await prisma.teacherProfile.findUnique({
    where: { userId },
  });

  if (!teacherProfile) {
    throw new Error(`TeacherProfile with userId ${userId} not found`);
  }
  const botConfigs = await prisma.botConfig.findMany({
    where: {
      teacherId: teacherProfile.id,
    },
  });
  return botConfigs;
});

export const getIsBotConfigArchivedByBotConfigId = cache(
  async ({ botConfigId }: { botConfigId: string }) => {
    try {
      const botConfig = await prisma.botConfig.findUnique({
        where: { id: botConfigId },
      });
      if (!botConfig) {
        return { success: false, message: "Bot config not found" };
      }

      if (botConfig.isActive)
        return { success: true, message: "Bot is active" };

      return { success: false, message: "Bot is archived" };
    } catch (err) {
      console.log(err);
      return { success: false, message: "Something went wrong" };
    }
  },
);

export const duplicateConfig = async function ({
  userId,
  classId,
  configId,
}: {
  userId: string;
  classId: string;
  configId: string;
}) {
  await isAuthorized({
    userType: "TEACHER",
  });
  const teacherProfile = await prisma.teacherProfile.findUnique({
    where: { userId },
  });

  if (!teacherProfile) {
    throw new Error(`TeacherProfile with userId ${userId} not found`);
  }
  try {
    const botConfig = await prisma.botConfig.findUnique({
      where: { id: configId },
      include: {
        parsedQuestions: true,
      },
    });

    if (!botConfig) {
      throw new Error(`BotConfig with id ${configId} not found`);
    }
    const parsedQuestions = botConfig.parsedQuestions;
    // Prisma automatically adds id to the parsedQuestions array, need to remove it. This will be automatically added by prisma
    const parsedQuestionsWithoutId = parsedQuestions.map(
      ({ botConfigId, id, ...rest }) => rest,
    );
    const originalName = botConfig.name;
    const copyTag = "Copy";
    let nameOfCopy;
    let copyNumber;

    // Extract the base name by removing any existing copy tags and numbers
    const baseNamePattern = /^(Copy(-\d+)?)\s(.*)$/;
    const baseNameMatch = originalName.match(baseNamePattern);
    const baseName = baseNameMatch ? baseNameMatch[3] : originalName;

    // Check for existing copy tag and number
    if (baseNameMatch) {
      // If already a copy, increment the number
      copyNumber = baseNameMatch[2]
        ? parseInt(baseNameMatch[2].slice(1)) + 1
        : 1;
      nameOfCopy = `${copyTag}-${copyNumber} ${baseName}`;
    } else {
      // For the first copy, just add "Copy"
      nameOfCopy = `${copyTag} ${baseName}`;
    }

    // Truncate to ensure it's within the 30-character limit
    nameOfCopy = nameOfCopy.slice(0, 30);

    const newBotConfig = await prisma.botConfig
      .create({
        data: {
          teacherId: teacherProfile.id,
          classId,
          name: nameOfCopy,
          type: botConfig.type,
          preferences: botConfig.preferences ?? {},
          parsedQuestions: {
            create: parsedQuestionsWithoutId,
          },
        },
      })
      .catch((err) => {
        console.log(err);
        throw new Error("Failed to create bot config");
      });
    revalidatePath(getTeacherHomeURL());
    return newBotConfig;
  } catch (error) {
    console.error("Error: ", error);
  }
};

export const getConfigNameByConfigId = cache(async function ({
  configId,
}: {
  configId: string;
}) {
  try {
    const botConfig = await prisma.botConfig.findUnique({
      where: { id: configId },
    });
    if (!botConfig) {
      return "";
    }
    return botConfig.name;
  } catch (error) {
    return "";
  }
});

export const getBotConfigByConfigId = cache(async function ({
  configId,
}: {
  configId: string;
}) {
  try {
    const botConfig = await prisma.botConfig.findUnique({
      where: { id: configId },
      include: {
        Class: true,
      },
    });
    if (!botConfig) {
      return null;
    }
    return botConfig;
  } catch (error) {
    return null;
  }
});

export const fetchConfigAndPreferences = cache(
  async ({ configId, type }: { configId: string; type: TaskType }) => {
    const emptyPreferences = {};
    try {
      const config = await prisma.botConfig.findUnique({
        where: { id: configId },
        include: {
          Class: true,
          avatar: true,
        },
      });
      let preferences;
      if (config && config.preferences) {
        preferences =
          typeof config.preferences === "string"
            ? JSON.parse(config.preferences)
            : config.preferences;
      } else {
        preferences = emptyPreferences;
      }

      return { preferences, config };
    } catch (error) {
      console.error("Failed to fetch:", error);
      return null;
    }
  },
);

export const updateBotConfigTimeLimit = async ({
  classId,
  botId,
  timeLimit,
}: {
  classId: string;
  botId: string;
  timeLimit: number;
}) => {
  await isAuthorized({
    userType: "TEACHER",
  });
  try {
    const hasTimeLimit = timeLimit !== 0;
    const result = await prisma.botConfig.update({
      where: { id: botId },
      data: {
        timeLimit: timeLimit,
        hasTimeLimit: hasTimeLimit,
      },
    });

    if (!result) {
      return { success: false };
    }
    revalidatePath(
      getTaskUrl({ classId, taskId: botId, type: result.type as TaskType }),
    );
    return { success: true };
  } catch (err) {
    console.log(err);
    return { success: false };
  }
};

export const enableReAttempt = async ({
  classId,
  taskId,
}: {
  classId: string;
  taskId: string;
}) => {
  await isAuthorized({
    userType: "TEACHER",
  });
  try {
    const result = await prisma.botConfig.update({
      where: { id: taskId },
      data: {
        canReAttempt: true,
      },
    });

    if (!result) {
      return { success: false };
    }
    revalidatePath(
      getTaskUrl({
        classId,
        taskId: taskId,
        type: result.type as TaskType,
      }),
    );
    return { success: true };
  } catch (err) {
    console.log(err);
    return { success: false };
  }
};

export const disableReAttempt = async ({
  classId,
  taskId,
}: {
  classId: string;
  taskId: string;
}) => {
  await isAuthorized({
    userType: "TEACHER",
  });
  try {
    const result = await prisma.botConfig.update({
      where: { id: taskId },
      data: {
        canReAttempt: false,
      },
    });

    if (!result) {
      return { success: false };
    }
    revalidatePath(
      getTaskUrl({
        classId,
        taskId: taskId,
        type: result.type as TaskType,
      }),
    );
    return { success: true };
  } catch (err) {
    console.log(err);
    return { success: false };
  }
};

export const getReattemptStatus = async ({ taskId }: { taskId: string }) => {
  try {
    const result = await prisma.botConfig.findUnique({
      where: { id: taskId },
      select: {
        canReAttempt: true,
      },
    });

    if (!result) {
      return { success: false };
    }
    return { success: true, canReAttempt: result.canReAttempt };
  } catch (err) {
    console.log(err);
    return { success: false };
  }
};

export const getAllBotChats = async ({
  studentBotId,
}: {
  studentBotId: string;
}) => {
  try {
    const botChats = await prisma.botChat.findMany({
      where: {
        botId: studentBotId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return botChats;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const addOrUpdateImage = async ({
  botId,
  bucket,
  key,
  url,
  revalidationUrl,
}: {
  botId: string;
  bucket: string;
  key: string;
  url?: string;
  revalidationUrl: string;
}) => {
  try {
    // First, attempt to retrieve the existing BotConfig with its associated HostedImage
    const existingConfig = await prisma.botConfig.findUnique({
      where: { id: botId },
      include: { avatar: true },
    });

    let avatar;

    if (existingConfig?.avatar) {
      // If an avatar already exists, update its details
      avatar = await prisma.hostedImage.update({
        where: { id: existingConfig.avatar.id },
        data: { bucket, key, url },
      });
    } else {
      avatar = await prisma.hostedImage.create({
        data: {
          bucket,
          key,
          url,
          BotConfig: {
            connect: { id: botId },
          },
        },
      });
    }

    revalidatePath(revalidationUrl);

    return avatar;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to add or update image");
  }
};

export const getStudentsByBotConfigId = cache(async function (
  botConfigId: string,
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
              isSubmitted: true,
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

      const studentResponses = bots.map((response) => {
        return {
          id: response.id,
          BotChatQuestions: response.BotChat[0].BotChatQuestions,
        };
      });

      return studentResponses;
    } catch (err) {
      return null;
    }
  },
);