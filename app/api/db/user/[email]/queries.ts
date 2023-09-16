import prisma from "@/prisma";

export const getUser = function (email: any) {
  return prisma.user.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      plan: true,
      subscriptionStart: true,
      subscriptionEnd: true,
      teacherProfile: {
        select: {
          bio: true,
        },
      },
    },
  });
};
