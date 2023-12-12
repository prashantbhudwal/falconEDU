"use client";
import { useRouter } from "next/navigation";
import { db } from "../routers";
import { getEditBotURL, getTaskUrl, getTestEditBotURL } from "@/lib/urls";
import { TaskType } from "@/types/dragon";

export function useDuplicateConfig() {
  const router = useRouter();
  const duplicateConfig = async ({
    userId,
    classId,
    configId,
    type,
  }: {
    userId: string;
    classId: string;
    configId: string;
    type: TaskType;
  }) => {
    const botConfig = await db.botConfig.duplicateConfig({
      classId,
      configId,
      userId,
    });
    if (!botConfig) {
      throw new Error("Failed to create bot config");
    }
    router.push(getTaskUrl({ classId, taskId: configId, type: type }));
  };

  return { duplicateConfig };
}
