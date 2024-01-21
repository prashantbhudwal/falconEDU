import { db } from "@/lib/routers";
import AITestForm from "./ai-test-form";
import { AITestPreferenceSchema } from "@/lib/schema";
import { z } from "zod";

export interface BotPageProps {
  params: {
    classId: string;
    taskId: string;
  };
}

export default async function AITestPage({ params }: BotPageProps) {
  const { classId, taskId } = params;
  const aiTestData = await db.botConfig.fetchConfigAndPreferences({
    configId: taskId,
    type: "ai-test",
  });
  const preferences = aiTestData?.preferences as z.infer<
    typeof AITestPreferenceSchema
  >;

  const config = aiTestData?.config;
  if (!config) {
    throw new Error("Bot config not found");
  }
  const Class = aiTestData.config?.Class;

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
