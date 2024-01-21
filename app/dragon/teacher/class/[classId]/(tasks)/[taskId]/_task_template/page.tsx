import { db } from "@/lib/routers";

export interface BotPageProps {
  params: {
    classId: string;
    taskId: string;
  };
}

export default async function BotPage({ params }: BotPageProps) {
  const { classId, taskId: botId } = params;
  // const botData = await db.botConfig.fetchConfigAndPreferences({
  //   configId: taskId,
  //   type: "chat",
  // });
  // const result = botPreferencesSchema.safeParse(botData?.preferences);

  // const preferences = result.success ? result.data : undefined;
  return <>Form</>;
}
