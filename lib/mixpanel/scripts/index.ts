"use server";

import prisma from "@/prisma";
import { createMixpanelProfile } from "..";

export async function createMixpanelUsersForExistingUsers() {
  const users = await prisma.user.findMany();

  console.log(users);
  for (const user of users) {
    await createMixpanelProfile(user.email as string, {
      $email: user.email as string,
      $name: user.name ?? "Unknown",
      $avatar: user.image ?? undefined,
      userType: user.userType,
    });
  }
}
