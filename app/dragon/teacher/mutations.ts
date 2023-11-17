"use server";
import prisma from "@/prisma";
import { revalidatePath } from "next/cache";
import { getBotsURL, getClassURL } from "@/lib/urls";
import { botPreferencesSchema, testBotPreferencesSchema } from "../schema";
import { getEditBotURL } from "@/lib/urls";
import * as z from "zod";
import { getClassesURL, getStudentsURL } from "@/lib/urls";
import { isAuthorized } from "@/lib/utils";
import { teacherPreferencesSchema } from "../schema";
import { redirect } from "next/navigation";
import { TestQuestions } from "../ai/test-question-parser/model";

//TODO: Add auth for functions

export const updateTeacherPreferences = async (
  teacherId: string,
  data: z.infer<typeof teacherPreferencesSchema>
) => {
  await isAuthorized({
    userType: "TEACHER",
  });
  try {
    const updatedTeacherProfile = await prisma.teacherProfile.update({
      where: { id: teacherId },
      data: {
        preferences: data,
      },
    });
    revalidatePath("/");
    return { updatedTeacherProfile, success: true };
  } catch (error) {
    console.error("Error updating TeacherProfile:", error);
    return { error: true };
  }
};

export const createClassForTeacher = async function (
  className: string,
  userId: string
) {
  await isAuthorized({
    userType: "TEACHER",
  });
  // Step 1: Fetch TeacherProfile based on userId
  const teacherProfile = await prisma.teacherProfile.findUnique({
    where: { userId },
  });

  if (!teacherProfile) {
    throw new Error(`TeacherProfile with userId ${userId} not found`);
  }

  // Step 2: Create new class
  const newClass = await prisma.class.create({
    data: {
      name: className,
      teacherId: teacherProfile.id, // Using the id of TeacherProfile
    },
  });
  revalidatePath(getClassesURL());
  return newClass;
};

export async function createBotConfig(
  userId: string,
  classId: string,
  botConfigName: string,
  configType: string
) {
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
        name: botConfigName,
        type: configType.toLocaleLowerCase(),
      },
    });
    revalidatePath(getBotsURL(classId));
    return botConfig;
  } catch (error) {
    console.error("Error: ", error);
  }
}

export const updateBotConfig = async (
  classId: string,
  botId: string,
  data: z.infer<typeof botPreferencesSchema>
): Promise<{ success: boolean; error?: any }> => {
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

export const updateBotConfigName = async (
  classId: string,
  botId: string,
  name: string
): Promise<{ success: boolean; error?: any }> => {
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

export const updateTestBotConfig = async (
  classId: string,
  botId: string,
  data: z.infer<typeof testBotPreferencesSchema>
): Promise<{ success: boolean; error?: any }> => {
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

export const updateTestBotConfigName = async (
  classId: string,
  botId: string,
  name: string
): Promise<{ success: boolean; error?: any }> => {
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

export const unPublishBotConfig = async (
  classId: string,
  botConfigId: string
) => {
  await isAuthorized({
    userType: "TEACHER",
  });
  try {
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
    return { success: true, updatedBotConfig };
  } catch (error) {
    console.error("Error updating BotConfig:", error);
    throw error;
  }
};

export const publishBotConfig = async (
  classId: string,
  botConfigId: string
) => {
  await isAuthorized({
    userType: "TEACHER",
  });
  try {
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

    return { success: true };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const deleteClassByClassId = (classId: string) => {
  deleteClass(classId);
  redirect("/dragon/teacher");
};

export const deleteClass = async (classId: string) => {
  try {
    const existingClass = await prisma.class.findUnique({
      where: { id: classId },
    });

    if (!existingClass) {
      throw new Error(`Class with ID ${classId} not found`);
    }

    await prisma.class.delete({
      where: { id: classId },
    });

    revalidatePath(getClassesURL());
    return {
      success: true,
      message: `Class with ID ${classId} deleted successfully`,
    };
  } catch (error) {
    console.error("Failed to delete class:", error);
    return { success: false, message: "Failed to delete class" };
  }
};

export const saveParsedQuestions = async (
  parsedQuestion: TestQuestions,
  botId: string
) => {
  await isAuthorized({
    userType: "TEACHER",
  });
  try {
    const transaction = await prisma.$transaction(async (prisma) => {
      const existingParsedQuestionWithBotId =
        await prisma.parsedQuestions.findMany({
          where: {
            botConfigId: botId,
          },
        });

      if (existingParsedQuestionWithBotId.length > 0) {
        await prisma.parsedQuestions.deleteMany({
          where: {
            botConfigId: botId,
          },
        });
      }

      await prisma.parsedQuestions.createMany({
        data: parsedQuestion.map((ques) => ({
          botConfigId: botId,
          question: ques.question,
          question_number: ques.question_number,
          question_type: "OBJECTIVE_FILL_IN_THE_BLANK_MULTIPLE_ANSWER",
          correct_answer: ques.correct_answer,
        })),
      });
    });
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: err };
  }
};
