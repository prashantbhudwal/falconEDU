"use client";
import { db } from "../../../../lib/routers";
import { useState } from "react";
import { BotConfig } from "@prisma/client";
import { TaskType } from "@/types/dragon";
import { trackEvent } from "@/lib/mixpanel";
import { useSession } from "next-auth/react";
export function useConfigPublishing({
  classId,
  botId,
  type,
}: {
  classId: string;
  botId: string;
  type: TaskType;
}) {
  const session = useSession();
  const email = session?.data?.user?.email as string;
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [config, setConfig] = useState<BotConfig | null>(null);
  const onPublish = async () => {
    setLoading(true);
    const result = await db.botConfig.publish({
      classId,
      botConfigId: botId,
      type,
    });
    setLoading(false);

    if (result.success) {
      setConfig(result.updatedBotConfig);
      trackEvent("teacher", "task_published", {
        distinct_id: email,
        task_id: botId,
        task_type: type,
        class_id: classId,
      });
    } else {
      if (result.message) {
        trackEvent("teacher", "task_publishing_failed", {
          distinct_id: email,
          task_id: botId,
          task_type: type,
          class_id: classId,
          isError: true,
        });
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
      type,
    });
    setLoading(false);
    if (result.success) {
      setConfig(result.updatedBotConfig);
      trackEvent("teacher", "task_unpublished", {
        distinct_id: email,
        task_id: botId,
        task_type: type,
        class_id: classId,
      });
    } else {
      if (result.message) {
        setError(result.message);
        trackEvent("teacher", "task_unpublishing_failed", {
          distinct_id: email,
          task_id: botId,
          task_type: type,
          class_id: classId,
          isError: true,
        });
        return;
      }
      setError("Failed to publish bot config. Please try again."); // set the error message
    }
  };
  return { onPublish, onUnPublish, error, config, loading };
}
