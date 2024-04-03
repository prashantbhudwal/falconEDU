import { UnwrapPromise } from "../../helpers";
import { getBotConfigByChatId } from "./router";

export type BotConfigByChatId = UnwrapPromise<
  ReturnType<typeof getBotConfigByChatId>
>;
