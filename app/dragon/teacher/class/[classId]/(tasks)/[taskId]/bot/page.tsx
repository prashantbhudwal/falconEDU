import { botPreferencesSchema } from "@/lib/schema";
import BotPreferencesForm from "./bot-form";
import { getTaskData } from "../get-task-data";

export interface BotPageProps {
  params: {
    classId: string;
    taskId: string;
  };
}

export default async function BotPage({ params }: BotPageProps) {
  const { classId, taskId } = params;
  const { preferences, config, grade } = await getTaskData({
    taskId,
    taskType: "chat",
    schema: botPreferencesSchema,
  });
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
