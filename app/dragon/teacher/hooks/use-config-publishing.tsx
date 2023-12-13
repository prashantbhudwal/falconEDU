"use client";
import { db } from "../routers";
import { revalidatePath } from "next/cache";
import { SetStateAction, useState } from "react";
import { BotConfig } from "@prisma/client";
import { TaskType } from "@/types/dragon";
export function useConfigPublishing({
  classId,
  botId,
  type,
}: {
  classId: string;
  botId: string;
  type: TaskType;
}) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [config, setConfig] = useState<BotConfig | null>(null);
  const onPublish = async () => {
    setLoading(true);
    const result = await db.botConfig.publishBotConfig({
      classId,
      botConfigId: botId,
      type
    });
    setLoading(false);

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
    setLoading(true);
    const result = await db.botConfig.unPublishBotConfig({
      classId,
      botConfigId: botId,
      type
    });
    setLoading(false);
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
  return { onPublish, onUnPublish, error, config, loading };
}
