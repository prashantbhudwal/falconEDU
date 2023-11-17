import { revalidatePath } from "next/cache";
import { publishBotConfig, unPublishBotConfig } from "./botConfigRouter";

const botConfigRouter = {
  publishBotConfig,
  unPublishBotConfig,
};

export const db = {
  botConfig: botConfigRouter,
};
