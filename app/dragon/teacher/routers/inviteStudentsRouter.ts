"use server";
import prisma from "@/prisma";
import { InvitationStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { cache } from "react";
import { UnwrapPromise } from "../../student/queries";

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
    return { success: true, error: "", addedInvitation };
  } catch (err: any) {
    if (err.code === "P2002") {
      return {
        success: false,
        error: "Student is already invited",
        addToInviteList: null,
      };
    }
    return {
      success: false,
      error: "Can't add to invite list",
      addToInviteList: null,
    };
  }
};

// export const checkInviteListwithEmail = async ({
//   studentEmail,
//   classId,
// }: {
//   studentEmail: string;
//   classId: string;
// }) => {
//   try {
//     const isAlreadyInvited = await prisma.invitation.findFirst({
//       where: {
//         AND: [
//           {
//             studentEmail,
//             classId,
//           },
//         ],
//       },
//     });
//     if (!isAlreadyInvited) {
//       return { success: true, error: "" };
//     }
//     return { success: false, error: "Student is already invited" };
//   } catch (err: any) {
//     return { success: false, error: "Can't add to invite list" };
//   }
// };

export const updateInviteTimehandler = async ({
  studentEmail,
  classId,
}: {
  studentEmail: string;
  classId: string;
}) => {
  try {
    const updatedInvitation = await prisma.invitation.update({
      where: { studentEmail, classId },
      data: {
        createdAt: new Date(),
        status: "PENDING",
      },
    });
    revalidatePath("/dragon/teacher/class");
    return { success: true, error: "", updatedInvitation };
  } catch (err: any) {
    return {
      success: false,
      error: "Can't update the invite list",
      updatedInvitation: null,
    };
  }
};

export const getInviteList = cache(async ({ classId }: { classId: string }) => {
  try {
    const inviteList = await prisma.invitation.findMany({
      where: { classId },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { inviteList };
  } catch (err: any) {
    return { inviteList: null };
  }
});

export type typeGetInviteList = UnwrapPromise<ReturnType<typeof getInviteList>>;

export const getInviteDetailsByInviteId = async ({
  inviteId,
}: {
  inviteId: string;
}) => {
  try {
    const invitedStudent = await prisma.invitation.findUnique({
      where: { id: inviteId },
      select: {
        id: true,
        studentEmail: true,
        status: true,
        classId: true,
        createdAt: true,
        Class: {
          select: {
            name: true,
            Teacher: {
              select: {
                User: true,
              },
            },
          },
        },
      },
    });
    return { success: true, error: "", invitedStudent };
  } catch (err) {
    console.log(err);
    return { success: true, error: "", invitedStudent: null };
  }
};

export const updateInvitationStausByInviteId = async ({
  inviteId,
  status,
}: {
  inviteId: string;
  status: InvitationStatus;
}) => {
  try {
    const updatedInvitation = await prisma.invitation.update({
      where: { id: inviteId },
      data: {
        status: status,
      },
    });
    revalidatePath("/dragon/teacher/class");
    return { success: true, error: "", updatedInvitation };
  } catch (err) {
    console.log(err);
    return { success: false, error: "", updatedInvitation: null };
  }
};
