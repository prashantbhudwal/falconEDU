"use server";
import prisma from "@/prisma";
import { revalidatePath } from "next/cache";
import { isAuthorized } from "@/lib/is-authorized";

//TODO Write a higher order function to add revalidation to the mutations
//TODO Add authorization to the mutations

export async function addToTeacher({
  userId,
  sourceData,
  revalidate,
}: {
  userId: string;
  sourceData: { title: string; description?: string; content: string };
  revalidate?: string;
}) {
  isAuthorized({ userType: "TEACHER" });
  const teacherProfile = await prisma.teacherProfile.findUnique({
    where: {
      userId: userId,
    },
  });
  if (!teacherProfile) {
    throw new Error("Teacher not found");
  }

  // Create a new Source and associate it with the TeacherProfile
  const newSource = await prisma.source.create({
    data: {
      title: sourceData.title,
      description: sourceData.description,
      content: sourceData.content,
      teacherProfileId: teacherProfile.id, // Associate the Source with the Teacher through TeacherProfile
    },
  });

  if (revalidate) {
    revalidatePath(revalidate);
  }
  return newSource;
}

export async function addToClass({
  classId,
  sourceData,
  revalidate,
}: {
  classId: string;
  sourceData: { title: string; description?: string; content: string };
  revalidate?: string;
}) {
  // Retrieve the class with the teacherId
  isAuthorized({ userType: "TEACHER" });
  const classWithTeacher = await prisma.class.findUnique({
    where: {
      id: classId,
    },
    select: {
      teacherId: true, // Only fetch the teacherId
    },
  });

  if (!classWithTeacher) {
    throw new Error("Class not found");
  }

  // Create a new Source and associate it with the Class and TeacherProfile
  const newSource = await prisma.source.create({
    data: {
      title: sourceData.title,
      description: sourceData.description,
      content: sourceData.content,
      classes: {
        connect: { id: classId }, // Connect the Source to the Class
      },
      teacherProfileId: classWithTeacher.teacherId, // Associate the Source with the Teacher through TeacherProfile
    },
  });

  if (revalidate) {
    revalidatePath(revalidate);
  }
  return newSource;
}

export async function addToTask({
  taskId,
  sourceData,
  revalidate,
}: {
  taskId: string;
  sourceData: { title: string; description?: string; content: string };
  revalidate?: string;
}) {
  isAuthorized({ userType: "TEACHER" });
  // find the teacherId from the taskId
  const task = await prisma.botConfig.findUnique({
    where: {
      id: taskId,
    },
    select: {
      teacherId: true,
    },
  });
  if (!task) {
    throw new Error("Task not found");
  }

  const classId = await prisma.botConfig.findUnique({
    where: {
      id: taskId,
    },
    select: {
      classId: true,
    },
  });

  if (!classId?.classId) {
    throw new Error("Class not found");
  }
  const source = await prisma.source.create({
    data: {
      title: sourceData.title,
      description: sourceData.description,
      content: sourceData.content,
      BotConfig: {
        connect: { id: taskId },
      },
      TeacherProfile: {
        connect: { id: task.teacherId },
      },
      classes: {
        connect: { id: classId.classId },
      },
    },
  });

  if (revalidate) {
    revalidatePath(revalidate);
  }

  return source;
}
