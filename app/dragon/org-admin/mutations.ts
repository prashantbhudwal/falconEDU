"use server";
import prisma from "@/prisma";
import { OrgType } from "@prisma/client";
import { revalidatePath } from "next/cache";

// export const addTeacherToOrg = async ({}) => {
//   try {
//     const response = await prisma.org.upsert({
//       where: { id: "Dragon" },
//       update: {
//         teacher: {
//           connect: {
//             id: "Teacher",
//           },
//         },
//       },
//       create: {
//         name: "Dragon",
//         teacher: {
//           connect: {
//             id: "Teacher",
//           },
//         },
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     return null;
//   }
// };

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

    //  const orgAdminProfile = await prisma.orgAdminProfile.findFirst({
    //    where: { userId: userId }, // Find the OrgAdminProfile using userId
    //  });

    //  if (!orgAdminProfile) {
    //    return null
    //  }

    //  const updatedOrgAdminProfile = await prisma.orgAdminProfile.update({
    //    where: { id: orgAdminProfile.id }, // Update the OrgAdminProfile using userId
    //    data: {
    //      orgId: createdOrg.id, // Connect the created Org to the OrgAdminProfile
    //    },
    //  });

    revalidatePath("/dragon/org-admin/");
    return createdOrg;
  } catch (err) {
    console.log(err);
    return null;
  }
};
