import { db } from "@/lib/routers";
import AITestForm from "./ai-test-form";
import { AITestPreferenceSchema } from "@/lib/schema";

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
    type: "ai-test",
  });
  const result = AITestPreferenceSchema.safeParse(botData?.preferences);

  const preferences = result.success ? result.data : undefined;

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
    <AITestForm
      classId={classId}
      taskId={taskId}
      preferences={preferences}
      taskConfig={config}
      grade={grade}
    />
  );
}
