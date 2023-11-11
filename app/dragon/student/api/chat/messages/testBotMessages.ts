import {
  botPreferences as botPreferencesTest,
  teacherPreferences as teacherPreferencesTest,
} from "../../../../test-data";
import { getTestQuestionsByBotChatId } from "../queries";

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
  - DON'T give any feedback, in any context.
  - FORMAT the question in markdown according to the question type. Options should be formatted as a list.

'''TEST''': 
  {fullTest}

Start with the first question. Ask the question, and record the answer. Then move to the next question. Repeat until the TEST is over.
`,
};

export async function getEngineeredTestBotMessages(botChatId: string) {
  const questions = await getTestQuestionsByBotChatId(botChatId);

  const { systemTemplate } = messageTemplates;
  console.log("questions", questions);

  const questionsWitRelevantFields = questions?.map((questionObject) => {
    const { question, correct_answer, sample_answer, question_type, hint } =
      questionObject;
    return { question, correct_answer, sample_answer, question_type, hint };
  });

  const stringifiedQuestions = JSON.stringify(questionsWitRelevantFields ?? "");

  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(systemTemplate),
  ]);

  const engineeredMessages = await chatPrompt.formatMessages({
    fullTest: stringifiedQuestions,
  });
  return engineeredMessages;
}
