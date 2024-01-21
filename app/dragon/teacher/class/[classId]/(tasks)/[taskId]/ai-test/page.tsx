import AITestForm from "./ai-test-form";
import { AITestPreferenceSchema } from "@/lib/schema";
import { getTaskData } from "../get-task-data";

export interface BotPageProps {
  params: {
    classId: string;
    taskId: string;
  };
}

export default async function AITestPage({ params }: BotPageProps) {
  const { classId, taskId } = params;
  const { preferences, config, grade } = await getTaskData({
    taskId,
    taskType: "ai-test",
    schema: AITestPreferenceSchema,
  });
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
