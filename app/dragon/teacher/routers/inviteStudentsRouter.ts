"use server";

import prisma from "@/prisma";
import { revalidatePath } from "next/cache";

export const addToInviteList = async ({
  studentEmail,
  classId,
}: {
  studentEmail: string;
  classId: string;
}) => {
  try {
    const addedInvitation = await prisma.invitation.create({
      data: {
        studentEmail,
        classId,
        status: "PENDING",
      },
    });
    revalidatePath("/dragon/teacher/class");
    return { success: true, error: "" };
  } catch (err: any) {
    return { success: false, error: "Can't add to invite list" };
  }
};

export const checkInviteListwithEmail = async ({
  studentEmail,
  classId,
}: {
  studentEmail: string;
  classId: string;
}) => {
  try {
    const isAlreadyInvited = await prisma.invitation.findFirst({
      where: {
        AND: [
          {
            studentEmail,
            classId,
          },
        ],
      },
    });
    if (!isAlreadyInvited) {
      return { success: true, error: "" };
    }
    return { success: false, error: "Student is already invited" };
  } catch (err: any) {
    return { success: false, error: "Can't add to invite list" };
  }
};

export const updateInviteTimehandler = async ({
  studentEmail,
  classId,
}: {
  studentEmail: string;
  classId: string;
}) => {
  try {
    const addedInvitation = await prisma.invitation.updateMany({
      where: {
        AND: [
          {
            studentEmail,
            classId,
          },
        ],
      },
      data: {
        createdAt: new Date(),
      },
    });
    revalidatePath("/dragon/teacher/class");
    return { success: true, error: "" };
  } catch (err: any) {
    return { success: false, error: "Can't update the invite list" };
  }
};

export const getInviteList = async () => {
  try {
    const inviteList = await prisma.invitation.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return { inviteList };
  } catch (err: any) {
    return { inviteList: null };
  }
};
