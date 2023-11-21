"use client";
import { useRouter } from "next/navigation";
import { db } from "../routers";
import { getEditBotURL, getTestEditBotURL } from "@/lib/urls";

export function useCreateNewConfig() {
  const router = useRouter();
  const createNewConfig = async (
    userId: string,
    classId: string,
    layoutSegment: string
  ) => {
    const configName =
      layoutSegment === "bots" ? "Untitled Bot" : "Untitled Test";
    const configType = layoutSegment === "bots" ? "chat" : "test";
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
    router.push(
      configType === "chat"
        ? getEditBotURL(classId, configId)
        : getTestEditBotURL(classId, configId)
    );
  };

  return createNewConfig;
}
