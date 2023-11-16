"use server";
import prisma from "@/prisma";

export const archiveClassByClassId = async (classId: string) => {
  try {
    const isClassExist = await prisma.class.findUnique({
      where: { id: classId },
    });

    if (!isClassExist) {
      throw new Error("class not found");
    }

    const updatedBotConfig = await prisma.botConfig.updateMany({
      where: { classId },
      data: { isActive: false },
    });
    return updatedBotConfig;
  } catch (err) {
    console.log(err);
    return null;
  }
};

// ----------------------------------------------------------------

export const updateClassNameByClassId = async (
  classId: string,
  name: string
) => {
  try {
    const response = await prisma.class.update({
      where: { id: classId },
      data: { name },
    });
    return response;
  } catch (err) {
    console.log(err);
    return null;
  }
};
