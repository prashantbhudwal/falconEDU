import { cache } from "react";
import BotPreferencesForm from "./bot-preferences-form";
import prisma from "@/prisma";
import { botPreferencesSchema } from "@/app/dragon/schema";
import { db } from "@/app/dragon/teacher/routers";

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
  const result = botPreferencesSchema.safeParse(botData?.preferences);

  const preferences = result.success ? result.data : undefined;

  return (
    <BotPreferencesForm
      preferences={preferences}
      botConfig={botData?.config!}
      classId={classId}
      botId={taskId}
    />
  );
}
