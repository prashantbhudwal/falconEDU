"use server";
import { isAuthorized } from "@/lib/utils";
import prisma from "@/prisma";
import { revalidatePath } from "next/cache";
import { getStudentsURL } from "@/lib/urls";

export const addStudentToClass = async (email: string, classId: string) => {
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

export const removeStudentFromClass = async (
  studentId: string,
  classId: string
) => {
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
