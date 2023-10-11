import TestPreferencesForm from "./test-preferences-form";
import { fetchTestBotConfig } from "@/app/dragon/teacher/queries";

export interface BotPageProps {
  params: {
    classId: string;
    testBotId: string;
  };
}

export default async function BotPage({ params }: BotPageProps) {
  const { classId, testBotId } = params;
  const botData = await fetchTestBotConfig(testBotId);

  return (
    <TestPreferencesForm
      preferences={botData?.preferences}
      botConfig={botData?.bot!}
      classId={classId}
      botId={testBotId}
    />
  );
}
