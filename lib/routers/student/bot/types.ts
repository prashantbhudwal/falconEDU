import { UnwrapPromise } from "../../helpers";
import { getBotByBotId, getBotsByUserId } from "./router";

export type BotsByUserId = UnwrapPromise<ReturnType<typeof getBotsByUserId>>;

export type GetBotByBotId = UnwrapPromise<ReturnType<typeof getBotByBotId>>;
