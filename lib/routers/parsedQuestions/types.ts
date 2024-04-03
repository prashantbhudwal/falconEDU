import { getParsedQuestionByBotConfigId } from "./router";

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
export type typeActiveParsedQuestionByBotConfigId = NonNullable<
  UnwrapPromise<
    ReturnType<typeof getParsedQuestionByBotConfigId>
  >["activeParsedQuestions"]
>[number];

export type typeArchivedParsedQuestionByBotConfigId = NonNullable<
  UnwrapPromise<
    ReturnType<typeof getParsedQuestionByBotConfigId>
  >["archivedParsedQuestions"]
>[number];
