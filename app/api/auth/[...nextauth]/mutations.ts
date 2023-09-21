import prisma from "@/prisma";
export const createUserProfile = async (id: string, userType: string) => {
  switch (userType) {
    case "TEACHER":
      const test = await prisma.teacherProfile.upsert({
        where: { userId: id },
        update: {},
        create: {
          userId: id,
        },
      });
      break;
    case "STUDENT":
      await prisma.studentProfile.upsert({
        where: { userId: id },
        update: {},
        create: {
          userId: id,
        },
      });
      break;
    default:
      throw new Error("Invalid user type");
  }
};
