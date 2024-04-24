"use client";
import { useRouter } from "next/navigation";
import { db } from "../../../../../lib/routers";
import { type TaskType } from "@/types/dragon";
import { getTaskProperties } from "../../../../../lib/helpers";
import { getTaskUrl } from "@/lib/urls";
import { trackEvent } from "@/lib/mixpanel";
import { useSession } from "next-auth/react";

export function useCreateNewConfig() {
  const router = useRouter();
  const session = useSession();
  const email = session?.data?.user?.email as string;
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
    try {
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
      trackEvent("teacher", "task_published", {
        distinct_id: email,
        task_id: configId,
        task_type: configType,
        class_id: classId,
      });
      router.push(getTaskUrl({ classId, taskId: configId, type: configType }));
    } catch (e) {
      trackEvent("teacher", "task_creation_failed", {
        distinct_id: email,
        task_id: "task_id_not_available",
        task_type: configType,
        class_id: classId,
        isError: true,
      });
      if (e instanceof Error) throw new Error(e.message);
    }
  };

  return createNewConfig;
}
