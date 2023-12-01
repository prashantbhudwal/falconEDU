"use server";
import * as z from "zod";
import {
  getBotsURL,
  getClassURL,
  getTeacherHomeURL,
  getTestEditBotURL,
} from "@/lib/urls";
import { type BotConfig } from "@prisma/client";
import { getClassesURL, getStudentsURL } from "@/lib/urls";
import { getEditBotURL } from "@/lib/urls";
import { isAuthorized } from "@/lib/utils";
import prisma from "@/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { botPreferencesSchema, testBotPreferencesSchema } from "../../schema";
import { cache } from "react";
import { UnwrapPromise } from "../../student/queries";
type BotPreferencesSchemaType = z.infer<typeof botPreferencesSchema>;
type TestBotPreferencesSchemaType = z.infer<typeof testBotPreferencesSchema>;
type ConfigTypeSchemaMap = {
  chat: BotPreferencesSchemaType;
  test: TestBotPreferencesSchemaType;
};
export type AllConfigsInClass = UnwrapPromise<
  ReturnType<typeof getAllConfigsInClass>
>;
export type AllConfigs = UnwrapPromise<ReturnType<typeof getAllConfigs>>;

export const publishBotConfig = async function ({
  classId,
  botConfigId,
}: {
  classId: string;
  botConfigId: string;
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
        message: `Can't Publish an Archived ${
          botConfig.type === "chat" ? "Bot" : "Test"
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
}: {
  classId: string;
  botConfigId: string;
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
          botConfig.type === "chat" ? "Bot" : "Test"
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
  configType: "chat" | "test";
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
export const updateBotConfig = async function <T extends "chat" | "test">({
  classId,
  botId,
  data,
  configType,
}: {
  classId: string;
  botId: string;
  data: ConfigTypeSchemaMap[T];
  configType: T;
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
    revalidatePath(getEditBotURL(classId, botId));
    return { success: true };
  } catch (error) {
    console.error("Failed to update:", error);
    return { success: false, error };
  }
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
    revalidatePath(getEditBotURL(classId, botId));
    return { success: true };
  } catch (error) {
    console.error("Failed to update:", error);
    return { success: false, error };
  }
};

const organizeConfigs = (botConfigs: BotConfig[]) => {
  const testConfigs = botConfigs.filter(
    (botConfig) => botConfig.type === "test"
  );
  const chatConfigs = botConfigs.filter(
    (botConfig) => botConfig.type === "chat"
  );

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

  const publishedChatConfigs = chatConfigs.filter(
    (botConfig) => botConfig.published
  );
  const unPublishedChatConfigs = chatConfigs.filter(
    (botConfig) => !botConfig.published
  );
  const publishedTestConfigs = testConfigs.filter(
    (botConfig) => botConfig.published
  );
  const unPublishedTestConfigs = testConfigs.filter(
    (botConfig) => !botConfig.published
  );

  const configs = {
    all: botConfigs,
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
  };
  return configs;
};

export const getAllConfigsInClass = cache(
  async ({ userId, classId }: { userId: string; classId: string }) => {
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
    });
    const configs = organizeConfigs(botConfigs);
    return configs;
  }
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
  const configs = organizeConfigs(botConfigs);
  return configs;
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
  }
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
      ({ botConfigId, id, ...rest }) => rest
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
