import { db } from "@/lib/routers";
import LessonForm from "./lesson-form";
import { lessonPreferencesSchema } from "@/lib/schema";
import { z } from "zod";

export interface BotPageProps {
  params: {
    classId: string;
    taskId: string;
  };
}

export default async function LessonPage({ params }: BotPageProps) {
  const { classId, taskId } = params;
  const lessonData = await db.botConfig.fetchConfigAndPreferences({
    configId: taskId,
    type: "lesson",
  });

  const preferences = lessonData?.preferences as z.infer<
    typeof lessonPreferencesSchema
  >;

  const config = lessonData?.config;
  if (!config) {
    throw new Error("Bot config not found");
  }
  const Class = lessonData.config?.Class;

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
