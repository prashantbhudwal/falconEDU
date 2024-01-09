"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import prisma from "@/prisma";
import { OrgType } from "@prisma/client";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

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
  name,
  type,
  userId,
}: {
  name: string;
  type: OrgType;
  userId: string;
}) => {
  try {
    const createdOrg = await prisma.org.create({
      data: {
        name: name,
        type: type,
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
