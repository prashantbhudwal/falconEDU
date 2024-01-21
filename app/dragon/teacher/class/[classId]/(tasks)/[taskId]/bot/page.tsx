import { botPreferencesSchema } from "@/lib/schema";
import BotPreferencesForm from "./bot-form";
import { db } from "@/lib/routers";
import { z } from "zod";

export interface BotPageProps {
  params: {
    classId: string;
    taskId: string;
  };
}

export default async function BotPage({ params }: BotPageProps) {
  const { classId, taskId } = params;
  const botData = await db.botConfig.fetchConfigAndPreferences({
    configId: taskId,
    type: "chat",
  });
  const preferences = botData?.preferences as z.infer<
    typeof botPreferencesSchema
  >;

  const config = botData?.config;
  if (!config) {
    throw new Error("Bot config not found");
  }
  const Class = botData.config?.Class;

  if (!Class) {
    throw new Error("Class not found");
  }

  const grade = Class.grade;

  return (
    <BotPreferencesForm
      preferences={preferences}
      botConfig={config}
      classId={classId}
      botId={taskId}
      grade={grade}
    />
  );
}
