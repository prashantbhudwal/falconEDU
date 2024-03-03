import { BotConfig } from "@prisma/client";

export type PublishResult = {
  success: boolean;
  message: string;
  updatedBotConfig: BotConfig | null;
};
