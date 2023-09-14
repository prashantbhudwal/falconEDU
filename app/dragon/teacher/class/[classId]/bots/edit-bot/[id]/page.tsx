import BotPreferencesForm from "../../bot-preferences-form";
import { fetchBotConfig } from "@/app/dragon/teacher/queries";

export interface BotPageProps {
  params: {
    classId: string;
    id: string;
  };
}

export default async function BotPage({ params }: BotPageProps) {
  const { classId, id } = params;
  const botConfig = await fetchBotConfig(id);

  return (
    <BotPreferencesForm
      initialValues={botConfig}
      classId={classId}
      botId={id}
    />
  );
}
