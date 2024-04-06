"use server";
import prisma from "@/prisma";
import { cache } from "react";
import { db } from "..";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { orgRegisterFormSchema } from "@/lib/schema/org-admin";

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

export const getAdminRoleByUserId = cache(
  async ({ userId }: { userId: string }) => {
    try {
      const adminProfile = await prisma.orgAdminProfile.findUnique({
        where: {
          userId: userId,
        },
        select: {
          adminRole: true,
        },
      });
      return adminProfile?.adminRole;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
);

export const addTeacherToOrg = async ({
  email,
  orgId,
}: {
  email: string;
  orgId: string;
}) => {
  try {
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
        orgId: orgId,
      },
    });
    revalidatePath("/dragon/org-admin/");
    return { teacher: addedTeacher, found: true };
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const removeTeacherFromOrg = async ({
  userId,
}: {
  userId: string;
}): Promise<boolean> => {
  try {
    await prisma.teacherProfile.update({
      where: {
        userId: userId,
      },
      data: {
        orgMode: false,
        orgId: null,
      },
    });
    revalidatePath("/dragon/org-admin/");
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const addStudentToOrg = async ({
  email,
  orgId,
}: {
  email: string;
  orgId: string;
}) => {
  try {
    const student = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
      },
    });

    if (!student) {
      return { student: null, found: false };
    }

    const addedStudent = await prisma.studentProfile.update({
      where: {
        userId: student.id,
      },
      data: {
        orgId: orgId,
      },
    });
    revalidatePath("/dragon/org-admin/");
    return { student: addedStudent, found: true };
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const removeStudentFromOrg = async ({
  userId,
}: {
  userId: string;
}): Promise<boolean> => {
  try {
    await prisma.studentProfile.update({
      where: {
        userId: userId,
      },
      data: {
        orgId: null,
      },
    });
    revalidatePath("/dragon/org-admin/");
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const addOrgAdminToOrg = async ({
  email,
  orgId,
}: {
  email: string;
  orgId: string;
}) => {
  try {
    const admin = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
      },
    });

    if (!admin) {
      return { admin: null, found: false };
    }

    const addedAdmin = await prisma.orgAdminProfile.update({
      where: {
        userId: admin.id,
      },
      data: {
        orgId: orgId,
      },
    });
    revalidatePath("/dragon/org-admin/");
    return { admin: addedAdmin, found: true };
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const removeOrgAdminFromOrg = async ({
  userId,
}: {
  userId: string;
}): Promise<boolean> => {
  try {
    await prisma.orgAdminProfile.update({
      where: {
        userId: userId,
      },
      data: {
        orgId: null,
      },
    });
    revalidatePath("/dragon/org-admin/");
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const getTeachersInOrg = cache(
  async ({ userId }: { userId: string }) => {
    try {
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

      const teachers = await prisma.teacherProfile.findMany({
        where: {
          orgId: org.org?.id,
        },
        include: {
          User: true,
        },
      }); // or find teachers from orgId

      return teachers;
    } catch (err) {
      console.error(err);
      return null;
    }
  },
);

export const getStudentsInOrg = cache(
  async ({ userId }: { userId: string }) => {
    try {
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

      const students = await prisma.studentProfile.findMany({
        where: {
          orgId: org.org?.id,
        },
        include: {
          User: true,
        },
      }); // or find students from orgId

      return students;
    } catch (err) {
      console.error(err);
      return null;
    }
  },
);

export const getOrgAdminsInOrg = cache(
  async ({ userId }: { userId: string }) => {
    try {
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

      const admins = await prisma.orgAdminProfile.findMany({
        where: {
          orgId: org.org?.id,
        },
        include: {
          User: true,
        },
      }); // or find admins from orgId

      return admins;
    } catch (err) {
      console.error(err);
      return null;
    }
  },
);

export async function setTeacherOrgModeToTrue(userId: string) {
  const updateTeacherProfile = await prisma.teacherProfile.upsert({
    where: {
      userId: userId,
    },
    update: {
      orgMode: true,
    },
    create: {
      userId: userId,
      // other required fields for creation
      orgMode: true,
    },
  });
  redirect("/dragon/teacher");

  return updateTeacherProfile;
}
