"use server";
import prisma from "@/prisma";
import { cache } from "react";
import { db } from ".";
import { orgRegisterFormSchema } from "@/app/dragon/org-admin/_components/org-register-form";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

export const getTeacherBrandNameByUserId = cache(
  async ({ userId }: { userId: string }) => {
    try {
      const teacherProfile = await prisma.teacherProfile.findUnique({
        where: {
          userId: userId,
        },
        select: {
          orgId: true,
        },
      });
      if (!teacherProfile) return { orgBrandName: null };
      const orgId = teacherProfile?.orgId;
      if (!orgId) return { orgBrandName: null };

      const teacherOrg = await prisma.org.findUnique({
        where: {
          id: orgId,
        },
        select: {
          brandName: true,
        },
      });
      return {
        orgBrandName: teacherOrg?.brandName,
      };
    } catch (err) {
      console.log(err);
      return { orgBrandName: null };
    }
  },
);

export const getStudentBrandNameByUserId = cache(
  async ({ userId }: { userId: string }) => {
    try {
      const studentProfile = await prisma.studentProfile.findUnique({
        where: {
          userId: userId,
        },
        select: {
          orgId: true,
        },
      });
      if (!studentProfile) return { orgBrandName: null };
      const orgId = studentProfile?.orgId;
      if (!orgId) return { orgBrandName: null };

      const studentOrg = await prisma.org.findUnique({
        where: {
          id: orgId,
        },
        select: {
          brandName: true,
        },
      });
      return {
        orgBrandName: studentOrg?.brandName,
      };
    } catch (err) {
      console.log(err);
      return { orgBrandName: null };
    }
  },
);

export const registerOrgWithUser = async ({
  data,
  userId,
}: {
  data: z.infer<typeof orgRegisterFormSchema>;
  userId: string;
}) => {
  try {
    const DUMMY_PINCODE = 123456;

    const orgData: Prisma.OrgCreateInput = {
      name: data.name,
      type: data.type,
      brandName: data.brandName,
      state: data.state,
      city: data.city,
      pincode: DUMMY_PINCODE,
      language_medium: data.language_medium,
      language_native: data.language_native,
      board: {
        connectOrCreate: {
          where: { name: data.boardNames },
          create: { name: data.boardNames },
        },
      },
    };

    const createdOrg = await prisma.org.create({
      data: orgData,
    });

    await prisma.orgAdminProfile.update({
      where: {
        userId: userId,
      },
      data: {
        orgId: createdOrg.id,
        adminRole: "SUPER_ADMIN",
      },
    });

    revalidatePath("/dragon/org-admin/");
    return createdOrg;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const updateOrg = async ({
  orgId,
  data,
}: {
  orgId: string;
  data: z.infer<typeof orgRegisterFormSchema>;
}) => {
  try {
    const orgData: Prisma.OrgUpdateInput = {
      name: data.name,
      type: data.type,
      brandName: data.brandName,
      state: data.state,
      city: data.city,
      language_medium: data.language_medium,
      language_native: data.language_native,
      board: {
        connectOrCreate: {
          where: { name: data.boardNames },
          create: { name: data.boardNames },
        },
      },
    };

    const updatedOrg = await prisma.org.update({
      where: {
        id: orgId,
      },
      data: orgData,
    });

    const updatedOrgWithBoard = await prisma.org.findUnique({
      where: {
        id: orgId,
      },
      include: {
        board: true,
      },
    });

    revalidatePath("/dragon/org-admin/");
    return updatedOrgWithBoard;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getOrgIdByUserId = cache(
  async ({ userId }: { userId: string }) => {
    try {
      const orgAdminProfile = await prisma.orgAdminProfile.findUnique({
        where: {
          userId: userId,
        },
        select: {
          orgId: true,
        },
      });
      return orgAdminProfile?.orgId;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
);

export const getOrgDataByOrgId = cache(async ({ orgId }: { orgId: string }) => {
  try {
    const org = await prisma.org.findUnique({
      where: {
        id: orgId,
      },
      include: {
        board: true,
      },
    });

    return org;
  } catch (err) {
    console.log(err);
    return null;
  }
});
