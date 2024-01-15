"use server";

import { isAuthorized } from "@/lib/is-authorized";
import { getStudentsURL } from "@/lib/urls";
import prisma from "@/prisma";
import { TaskType } from "@/types";
import { revalidatePath } from "next/cache";
import { cache } from "react";
import { UnwrapPromise } from "../../student/queries";

export const addStudentToClass = async ({
  email,
  classId,
}: {
  email: string;
  classId: string;
}) => {
  await isAuthorized({ userType: "TEACHER" });

  try {
    // Transaction begins here
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, userType: true },
    });

    if (!user || user.userType !== "STUDENT") {
      return { notFound: true };
    }
    const result = await prisma.$transaction(async (prisma) => {
      // Check if user exists and is a student

      // Check if student profile exists, create if not
      let studentProfile = await prisma.studentProfile.findUnique({
        where: { userId: user.id },
      });

      console.log(studentProfile);

      if (!studentProfile) {
        studentProfile = await prisma.studentProfile.create({
          data: {
            userId: user.id,
            grade: "",
          },
        });
      }

      // Add student to class
      await prisma.class.update({
        where: { id: classId },
        data: {
          students: {
            connect: { id: studentProfile.id },
          },
        },
      });

      // Fetch existing botConfigs for the class
      const botConfigs = await prisma.botConfig.findMany({
        where: { classId, isActive: true, published: true },
      });

      // Fetch teacher's name for the bot
      const teacherData = await prisma.class.findUnique({
        where: { id: classId },
        select: {
          Teacher: {
            include: { User: true },
          },
        },
      });

      if (!teacherData || !teacherData.Teacher || !teacherData.Teacher.User) {
        return { notFound: true };
      }

      const teacherName = teacherData.Teacher.User.name || "Unknown";

      // For each botConfig, create a bot for the student if it doesn't exist
      for (const botConfig of botConfigs) {
        const existingBot = await prisma.bot.findFirst({
          where: {
            AND: [
              { studentId: studentProfile.id },
              { botConfigId: botConfig.id },
            ],
          },
        });

        if (!existingBot) {
          await prisma.bot.create({
            data: {
              studentId: studentProfile.id,
              botConfigId: botConfig.id,
              name: teacherName,
              BotChat: {
                create: {
                  isDefault: true,
                  messages: [],
                },
              },
            },
          });
        }
      }

      return { success: true };
    });

    revalidatePath(getStudentsURL(classId));
    return { success: true };
  } catch (error) {
    console.error("Error adding student to class:", error);
    return { error: true };
  }
};

export const removeStudentFromClass = async ({
  studentId,
  classId,
}: {
  studentId: string;
  classId: string;
}) => {
  await isAuthorized({
    userType: "TEACHER",
  });
  try {
    await prisma.$transaction(async (prisma) => {
      // Remove student from class
      await prisma.class.update({
        where: { id: classId },
        data: {
          students: {
            disconnect: { id: studentId },
          },
        },
      });

      // Deactivate the bots for the student for this class
      await prisma.bot.updateMany({
        where: {
          studentId: studentId,
          BotConfig: {
            classId: classId,
          },
        },
        data: {
          isActive: false,
        },
      });
    });

    revalidatePath(getStudentsURL(classId));
    return { success: true };
  } catch (error) {
    console.error("Error removing student from class:", error);
    return { error: true };
  }
};

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
        (student) => student.id
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
        currentStudentsIds.includes(bot.studentId)
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
        0
      );

      const chatCount =
        total_number_of_chat_of_a_task / currentStudents.students.length;

      const totalSubmittedStudents = botForCurrentStudents.filter(
        (bot) => bot.isSubmitted
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
  }
);

export type TypeGetTaskStats = UnwrapPromise<ReturnType<typeof getTaskStats>>;

export const getLeastInteractedTasks = cache(
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
        (student) => student.id
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
        }
      );

      const sortedTasksWithInteractedStudentsCount =
        tasksWithInteractedStudentsCount.sort(
          (a, b) => a.interactedStudents - b.interactedStudents
        );

      return sortedTasksWithInteractedStudentsCount;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
);

//OLD
// export const addStudentToClassOld = async (email: string, classId: string) => {
//   await isAuthorized({
//     userType: "TEACHER",
//   });
//   try {
//     // Check if user exists and is a student
//     const user = await prisma.user.findUnique({
//       where: { email },
//       select: { id: true, userType: true },
//     });

//     if (!user || user.userType !== "STUDENT") {
//       return { notFound: true };
//     }

//     // Check if student profile exists, create if not
//     let studentProfile = await prisma.studentProfile.findUnique({
//       where: { userId: user.id },
//     });

//     if (!studentProfile) {
//       studentProfile = await prisma.studentProfile.create({
//         data: {
//           userId: user.id,
//           grade: "",
//         },
//       });
//     }

//     // Add student to class
//     await prisma.class.update({
//       where: { id: classId },
//       data: {
//         students: {
//           connect: { id: studentProfile.id },
//         },
//       },
//     });
//     revalidatePath(getStudentsURL(classId));
//     return { success: true };
//   } catch (error) {
//     console.error("Error adding student to class:", error);
//     return { error: true };
//   }
// };

// export const removeStudentFromClassOld = async (
//   studentId: string,
//   classId: string
// ) => {
//   await isAuthorized({
//     userType: "TEACHER",
//   });
//   try {
//     // Remove student from class
//     await prisma.class.update({
//       where: { id: classId },
//       data: {
//         students: {
//           disconnect: { id: studentId },
//         },
//       },
//     });
//     revalidatePath(getStudentsURL(classId));
//     return { success: true };
//   } catch (error) {
//     console.error("Error removing student from class:", error);
//     return { error: true };
//   }
// };
