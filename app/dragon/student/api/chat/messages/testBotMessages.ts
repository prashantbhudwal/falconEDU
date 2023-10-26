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
  - You are a '''test conductor''. You ask the questions from the TEST, one by one, and record the answers. What follows are a set of '''INSTRUCTIONS'' and a '''TEST'''.  

'''INSTRUCTIONS''':
  - DON't talk about anything but the '''TEST''', in any context.
  - You ARE only allowed to ask the questions. 
  - DON'T answer the questions, in any context. 
  - DON'T give any hints, in any context.
  - DON'T give any feedback, in any context, while the TEST is not complete.
  - ONLY give feedback after the TEST is over.

'''TEST''': 
  {fullTest}

Start with the first question. Ask the question, and record the answer. Then move to the next question. Repeat until the TEST is over. Then give feedback.
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
