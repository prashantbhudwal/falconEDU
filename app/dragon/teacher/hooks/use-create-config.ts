"use client";
import { useRouter } from "next/navigation";
import { db } from "../../../../lib/routers";
import { type TaskType } from "@/types/dragon";
import { getTaskProperties } from "../utils";
import { getTaskUrl } from "@/lib/urls";

export function useCreateNewConfig() {
  const router = useRouter();
  const createNewConfig = async ({
    userId,
    classId,
    configType,
    name,
  }: {
    userId: string;
    classId: string;
    configType: TaskType;
    name?: string;
  }) => {
    let configName =
      name && name.length > 0 ? name : getTaskProperties(configType).newName;

    const botConfig = await db.botConfig.createBotConfig({
      userId,
      classId,
      configName,
      configType,
    });
    const configId = botConfig?.id;
    if (!configId) {
      throw new Error("Failed to create bot config");
    }
    router.push(getTaskUrl({ classId, taskId: configId, type: configType }));
  };

  return createNewConfig;
}
