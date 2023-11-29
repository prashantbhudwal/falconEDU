"use client";
import { useRouter } from "next/navigation";
import { db } from "../routers";
import { getEditBotURL, getTestEditBotURL } from "@/lib/urls";

export function useDuplicateConfig() {
  const router = useRouter();
  const duplicateConfig = async ({
    userId,
    classId,
    configId,
  }: {
    userId: string;
    classId: string;
    configId: string;
  }) => {
    const botConfig = await db.botConfig.duplicateConfig({
      classId,
      configId,
      userId,
    });
    if (!botConfig) {
      throw new Error("Failed to create bot config");
    }
    router.push(
      botConfig.type === "chat"
        ? getEditBotURL(classId, botConfig.id)
        : getTestEditBotURL(classId, botConfig.id)
    );
  };

  return { duplicateConfig };
}
