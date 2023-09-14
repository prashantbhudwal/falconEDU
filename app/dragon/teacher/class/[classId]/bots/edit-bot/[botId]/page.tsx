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
  const botConfig = await fetchBotConfig(botId);

  return (
    <BotPreferencesForm
      initialValues={botConfig}
      classId={classId}
      botId={botId}
    />
  );
}
