"use server";
import prisma from "@/prisma";
import { revalidatePath } from "next/cache";

// ----------------------------------------------------------------

export const updateClassNameByClassId = async (
  classId: string,
  name: string,
) => {
  try {
    const response = await prisma.class.update({
      where: { id: classId },
      data: { name },
    });
    return response;
  } catch (err) {
    console.error(err);
    return null;
  }
};
