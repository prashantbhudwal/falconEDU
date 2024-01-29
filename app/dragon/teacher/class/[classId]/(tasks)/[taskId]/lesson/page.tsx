import LessonForm from "./lesson-form";
import { lessonPreferencesSchema } from "@/lib/schema";
import { getTaskData } from "../get-task-data";

export interface BotPageProps {
  params: {
    classId: string;
    taskId: string;
  };
}

export default async function LessonPage({ params }: BotPageProps) {
  const { classId, taskId } = params;
  const { preferences, config, grade } = await getTaskData({
    taskId,
    taskType: "lesson",
    schema: lessonPreferencesSchema,
  });

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
