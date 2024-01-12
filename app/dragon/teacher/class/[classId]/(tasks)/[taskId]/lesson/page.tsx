import { db } from "@/app/dragon/teacher/routers";
import LessonForm from "./lesson-form";
import { lessonPreferencesSchema } from "@/app/dragon/schema";

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
    type: "lesson",
  });
  const result = lessonPreferencesSchema.safeParse(botData?.preferences);

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
    <LessonForm
      classId={classId}
      taskId={taskId}
      preferences={preferences}
      taskConfig={config}
      grade={grade}
    />
  );
}
