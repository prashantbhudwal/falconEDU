import { UnwrapPromise } from "../../helpers";
import { getTestResultsByBotChatId } from "./router";

export type TestResultsByBotId = UnwrapPromise<
  ReturnType<typeof getTestResultsByBotChatId>
>;
