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

  return (
    <LessonForm
      classId={classId}
      taskId={taskId}
      preferences={preferences}
      taskConfig={botData?.config!}
    />
  );
}
