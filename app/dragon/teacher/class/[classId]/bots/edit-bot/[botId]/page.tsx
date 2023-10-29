import { cache } from "react";
import BotPreferencesForm from "./bot-preferences-form";
import prisma from "@/prisma";
import { botPreferencesSchema } from "@/app/dragon/schema";

export interface BotPageProps {
  params: {
    classId: string;
    botId: string;
  };
}

const emptyPreferences = {}; // or whatever default you want

const fetchBotConfig = cache(async (botId: string) => {
  try {
    const bot = await prisma.botConfig.findUnique({
      where: { id: botId },
    });

    console.log("Fetched successfully.");

    let preferences;
    if (bot && bot.preferences) {
      preferences =
        typeof bot.preferences === "string"
          ? JSON.parse(bot.preferences)
          : bot.preferences;
    } else {
      preferences = emptyPreferences;
    }

    const result = botPreferencesSchema.safeParse(preferences);

    if (result.success) {
      return { preferences: result.data, bot };
    } else {
      console.error("Validation failed:", result.error);
      return { preferences: null, bot };
    }
  } catch (error) {
    console.error("Failed to fetch:", error);
    return null;
  }
});

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
