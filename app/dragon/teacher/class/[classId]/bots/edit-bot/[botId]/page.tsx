import BotPreferencesForm from "./bot-preferences-form";
import { fetchBotConfig } from "@/app/dragon/teacher/queries";

export interface BotPageProps {
  params: {
    classId: string;
    botId: string;
  };
}

export default async function BotPage({ params }: BotPageProps) {
  const { classId, botId } = params;
  const botData = await fetchBotConfig(botId);

  return (
    <BotPreferencesForm
      preferences={botData?.preferences}
      botConfig={botData?.bot!}
      classId={classId}
      botId={botId}
    />
  );
}
