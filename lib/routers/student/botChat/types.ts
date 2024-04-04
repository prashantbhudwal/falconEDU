import { z } from "zod";
import { UnwrapPromise } from "../../helpers";
import { getBotChatByChatId, getChatsByBotId } from "./router";
import { TestResultsAnswerSchema } from "@/app/dragon/ai/test-checker/tool";

export type ChatsByBotId = UnwrapPromise<ReturnType<typeof getChatsByBotId>>;

export type BotChatByChatId = UnwrapPromise<
  ReturnType<typeof getBotChatByChatId>
>;

const testResultObjectSchemaWithId = z.array(
  TestResultsAnswerSchema.extend({
    id: z.string(),
  }),
);
export type FinalTestResults = z.infer<typeof testResultObjectSchemaWithId>;