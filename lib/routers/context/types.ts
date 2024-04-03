import { UnwrapPromise } from "../helpers";
import { aiTest, chat, lesson, test } from "./queries";
export type AITestContext = UnwrapPromise<ReturnType<typeof aiTest>>;
export type ChatContext = UnwrapPromise<ReturnType<typeof chat>>;
export type LessonContext = UnwrapPromise<ReturnType<typeof lesson>>;
export type TestContext = UnwrapPromise<ReturnType<typeof test>>;
export type Contexts =
  | LessonContext
  | ChatContext
  | AITestContext
  | TestContext;

export type TaskContextMap = {
  chat: ChatContext;
  test: TestContext;
  lesson: LessonContext;
  "ai-test": AITestContext;
};
