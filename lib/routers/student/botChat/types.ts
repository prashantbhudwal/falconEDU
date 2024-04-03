import { UnwrapPromise } from "../../helpers";
import { getBotChatByChatId, getChatsByBotId } from "./router";

export type ChatsByBotId = UnwrapPromise<ReturnType<typeof getChatsByBotId>>;

export type BotChatByChatId = UnwrapPromise<
  ReturnType<typeof getBotChatByChatId>
>;
