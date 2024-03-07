"use server";
import * as z from "zod";
import { getBotsURL, getTaskUrl, getTeacherHomeURL } from "@/lib/urls";
import { isAuthorized } from "@/lib/utils";
import prisma from "@/prisma";
import { revalidatePath } from "next/cache";
import { cache } from "react";
import { UnwrapPromise } from "../../../app/dragon/student/queries";
import { TaskType } from "@/types/dragon";
import { getTaskProperties } from "../../helpers";
import {
  AITestPreferenceSchema,
  botPreferencesSchema,
  lessonPreferencesSchema,
  testBotPreferencesSchema,
} from "@/lib/schema";
import { BotConfig } from "@prisma/client";
import { PublishResult } from "./publish.types";
type BotPreferencesSchemaType = z.infer<typeof botPreferencesSchema>;
type TestBotPreferencesSchemaType = z.infer<typeof testBotPreferencesSchema>;
type LessonPreferencesSchemaType = z.infer<typeof lessonPreferencesSchema>;
type AITestPreferencesSchemaType = z.infer<typeof AITestPreferenceSchema>;
type ConfigTypeSchemaMap = {
  chat: BotPreferencesSchemaType;
  test: TestBotPreferencesSchemaType;
  lesson: LessonPreferencesSchemaType;
  "ai-test": AITestPreferencesSchemaType;
};
export type AllConfigsInClass = UnwrapPromise<
  ReturnType<typeof getAllConfigsInClass>
>;
export type AllConfigs = UnwrapPromise<ReturnType<typeof getAllConfigs>>;

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

export type typeGetBotConfigByConfigId = UnwrapPromise<
  ReturnType<typeof getBotConfigByConfigId>
>;

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
    });
    return botChats;
  } catch (err) {
    console.log(err);
    return [];
  }
};
export type AllBotChats = UnwrapPromise<ReturnType<typeof getAllBotChats>>;

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
