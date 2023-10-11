import {
  botPreferences as botPreferencesTest,
  teacherPreferences as teacherPreferencesTest,
} from "../../../../test-data";
import { getTestChatContextByChatId } from "../queries";

import { isEmptyObject } from "../queries";
import {
  botPreferencesSchema,
  teacherPreferencesSchema,
  testBotPreferencesSchema,
} from "../../../../schema";
import * as z from "zod";
import {
  ChatPromptTemplate,
  PromptTemplate,
  SystemMessagePromptTemplate,
  AIMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "langchain/prompts";
import { AIMessage, HumanMessage, SystemMessage } from "langchain/schema";
import { type BotConfig } from "@prisma/client";
import { type ChatContextByChatId } from "../queries";

const studentPreferences = {
  name: "Ramiz",
  languageProficiency: "native",
  likes: ["reading", "writing"],
  dislikes: ["ice cream", "chocolate"],
};

const { name: studentName, likes, dislikes } = studentPreferences;

const messageTemplates = {
  systemTemplate: `
  You are a test conductor. Your job is to ask the questions from the following test one by one, and record the answers. You are not allowed to answer the questions yourself. You are only allowed to ask the questions. You are not allowed to give any hints.

  TEST: {fullTest}
`,
};

export async function getEngineeredTestBotMessages(botChatId: string) {
  const context = await getTestChatContextByChatId(botChatId);
  if (!context) {
    console.error("context not found for chatId:");
  }
  const teacherName = context?.teacherName;
  const studentName = context?.studentName;

  let testBotPreferences = context?.botPreferences as z.infer<
    typeof testBotPreferencesSchema
  >;
  let teacherPreferences = context?.teacherPreferences as z.infer<
    typeof teacherPreferencesSchema
  >;

  if (isEmptyObject(testBotPreferences) || testBotPreferences === undefined) {
    testBotPreferences = { fullTest: "Test This is a long Test" };
  }
  if (isEmptyObject(teacherPreferences) || teacherPreferences === undefined) {
    teacherPreferences = teacherPreferencesTest[0];
  }
  const mergedSchema = testBotPreferencesSchema.merge(teacherPreferencesSchema);

  const { fullTest } = testBotPreferences;

  const { personalInformation, professionalInformation, likes, dislikes } =
    teacherPreferences;

  console.log("teacherPreferences", teacherPreferences);

  const { systemTemplate } = messageTemplates;

  const chatPrompt = ChatPromptTemplate.fromPromptMessages<
    z.infer<typeof mergedSchema>
  >([SystemMessagePromptTemplate.fromTemplate(systemTemplate)]);

  const engineeredMessages = await chatPrompt.formatMessages({
    fullTest: fullTest,
    studentName: studentName,
    teacherName: teacherName,
    likes: likes,
    dislikes: dislikes,
    personalInformation: personalInformation,
    professionalInformation: professionalInformation,
  });
  // console.log("EMsgs", engineeredMessages);
  return engineeredMessages;
}
