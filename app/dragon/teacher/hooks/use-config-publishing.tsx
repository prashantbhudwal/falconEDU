"use client";
import { db } from "../routers";
import { revalidatePath } from "next/cache";
import { SetStateAction, useState } from "react";
import { BotConfig } from "@prisma/client";
export function useConfigPublishing({
  classId,
  botId,
}: {
  classId: string;
  botId: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<BotConfig | null>(null);
  const onPublish = async () => {
    const result = await db.botConfig.publishBotConfig({
      classId,
      botConfigId: botId,
    });

    if (result.success) {
      setConfig(result.updatedBotConfig);
    } else {
      if (result.message) {
        setError(result.message);
        return;
      }
      setError("Failed to publish bot config. Please try again."); // set the error message
    }
  };

  const onUnPublish = async () => {
    const result = await db.botConfig.unPublishBotConfig({
      classId,
      botConfigId: botId,
    });
    if (result.success) {
      setConfig(result.updatedBotConfig);
    } else {
      if (result.message) {
        setError(result.message);
        return;
      }
      setError("Failed to publish bot config. Please try again."); // set the error message
    }
  };
  return { onPublish, onUnPublish, error, config };
}
