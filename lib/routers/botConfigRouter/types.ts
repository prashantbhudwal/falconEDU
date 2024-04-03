import {
  AITestPreferenceSchema,
  botPreferencesSchema,
  lessonPreferencesSchema,
  testBotPreferencesSchema,
} from "@/lib/schema";
import { UnwrapPromise } from "../../../app/dragon/student/queries";
import {
  getAllBotChats,
  getAllConfigs,
  getAllConfigsInClass,
  getBotConfigByConfigId,
} from "./all";
import { z } from "zod";

export type BotPreferencesSchemaType = z.infer<typeof botPreferencesSchema>;
export type TestBotPreferencesSchemaType = z.infer<
  typeof testBotPreferencesSchema
>;
export type LessonPreferencesSchemaType = z.infer<
  typeof lessonPreferencesSchema
>;
export type AITestPreferencesSchemaType = z.infer<
  typeof AITestPreferenceSchema
>;
export type ConfigTypeSchemaMap = {
  chat: BotPreferencesSchemaType;
  test: TestBotPreferencesSchemaType;
  lesson: LessonPreferencesSchemaType;
  "ai-test": AITestPreferencesSchemaType;
};
export type AllConfigsInClass = UnwrapPromise<
  ReturnType<typeof getAllConfigsInClass>
>;
export type AllConfigs = UnwrapPromise<ReturnType<typeof getAllConfigs>>;

export type typeGetBotConfigByConfigId = UnwrapPromise<
  ReturnType<typeof getBotConfigByConfigId>
>;

export type AllBotChats = UnwrapPromise<ReturnType<typeof getAllBotChats>>;
