"use client";
import {
  publishBotConfig,
  unPublishBotConfig,
} from "@/app/dragon/teacher/mutations";
import { SetStateAction, useState } from "react";
export function useConfigPublishing({
  classId,
  botId,
}: {
  classId: string;
  botId: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const onPublish = async () => {
    const result = await publishBotConfig(classId, botId);
    if (result.success) {
    } else {
      setError("Failed to publish bot config. Please try again."); // set the error message
    }
  };

  const onUnPublish = async () => {
    const result = await unPublishBotConfig(classId, botId);
    if (result.success) {
    } else {
      setError("Failed to publish bot config. Please try again."); // set the error message
    }
  };
  return { onPublish, onUnPublish, error };
}
