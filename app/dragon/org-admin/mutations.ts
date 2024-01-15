"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import prisma from "@/prisma";
import { OrgType } from "@prisma/client";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { orgRegisterFormSchema } from "./_components/org-register-form";
import { z } from "zod";

const getUserId = async (): Promise<string> => {
  const session = await getServerSession(authOptions);
  return session?.user.id || "";
}; //TODO: dont use this function to get userId pass from the layout to all components

export const addTeacherToOrg = async ({ email }: { email: string }) => {
  try {
    const userId = await getUserId();
    const org = await prisma.orgAdminProfile.findUnique({
      where: {
        userId,
      },
      select: {
        org: true,
      },
    });

    if (!org) {
      return null;
    }

    const teacher = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
      },
    });

    if (!teacher) {
      return { teacher: null, found: false };
    }

    const addedTeacher = await prisma.teacherProfile.update({
      where: {
        userId: teacher.id,
      },
      data: {
        orgMode: true,
        orgId: org.org?.id,
      },
    });
    revalidatePath("/dragon/org-admin/add-teachers");
    return { teacher: addedTeacher, found: true };
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const registerOrg = async ({
  values,
  userId,
}: {
  values: z.infer<typeof orgRegisterFormSchema>;
  userId: string;
}) => {
  try {
    let createdBotId: null | string = null;
    const existingBoard = await prisma.board.findFirst({
      where: {
        name: values.boardNames,
      },
    });

    if (!existingBoard) {
      const createdBoards = await prisma.board.create({
        data: {
          name: values.boardNames,
        },
      });
      createdBotId = createdBoards.id;
    }
    const dummyPincode = 123456;

    const createdOrg = await prisma.org.create({
      data: {
        name: values.name,
        type: values.type,
        brandName: values.brandName,
        state: values.state,
        city: values.city,
        pincode: dummyPincode,
        language_medium: values.language_medium,
        language_native: values.language_native,
        board: {
          connect: {
            id: createdBotId || existingBoard?.id,
          },
        },
      },
    });
    if (!createdOrg) {
      return null;
    }

    await prisma.orgAdminProfile.update({
      where: {
        userId: userId,
      },
      data: {
        orgId: createdOrg.id,
      },
    });
    revalidatePath("/dragon/org-admin/");
    return createdOrg;
  } catch (err) {
    console.log(err);
    return null;
  }
};
