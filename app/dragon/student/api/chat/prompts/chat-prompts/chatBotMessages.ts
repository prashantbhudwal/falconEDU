import {
  botPreferences as botPreferencesTest,
  teacherPreferences as teacherPreferencesTest,
} from "../../../../../test-data";
import { getChatContextByChatId } from "./queries";
import { messageTemplates } from "./chat-template";

import { isEmptyObject } from "./queries";
import {
  botPreferencesSchema,
  teacherPreferencesSchema,
} from "../../../../../schema";
import * as z from "zod";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "langchain/prompts";

const studentPreferences = {
  name: "Ramiz",
  languageProficiency: "native",
  likes: ["reading", "writing"],
  dislikes: ["ice cream", "chocolate"],
};

const { name: studentName, likes, dislikes } = studentPreferences;

export async function getEngineeredChatBotMessages(botChatId: string) {
  const context = await getChatContextByChatId(botChatId);
  if (!context) {
    console.error("context not found for chatId:");
  }
  const teacherName = context?.teacherName;
  const studentName = context?.studentName;

  let botPreferences = context?.botPreferences as z.infer<
    typeof botPreferencesSchema
  >;
  let teacherPreferences = context?.teacherPreferences as z.infer<
    typeof teacherPreferencesSchema
  >;

  if (isEmptyObject(botPreferences) || botPreferences === undefined) {
    botPreferences = botPreferencesTest[0];
  }
  if (isEmptyObject(teacherPreferences) || teacherPreferences === undefined) {
    teacherPreferences = teacherPreferencesTest[0];
  }
  const mergedSchema = botPreferencesSchema.merge(teacherPreferencesSchema);

  const {
    instructions,
    subjects,
    grades,
    board,
    tone,
    language,
    humorLevel,
    languageProficiency,
  } = botPreferences;

  const { personalInformation, professionalInformation, likes, dislikes } =
    teacherPreferences;


  const { systemTemplate, humanTemplate } = messageTemplates;

  const chatPrompt = ChatPromptTemplate.fromPromptMessages<
    z.infer<typeof mergedSchema>
  >([
    SystemMessagePromptTemplate.fromTemplate(systemTemplate),
    HumanMessagePromptTemplate.fromTemplate(humanTemplate),
  ]);

  const engineeredMessages = await chatPrompt.formatMessages({
    board: board,
    grades: JSON.stringify(grades),
    humorLevel: humorLevel,
    instructions: instructions,
    language: language,
    languageProficiency: languageProficiency,
    subjects: JSON.stringify(subjects),
    tone: tone,
    personalInformation: personalInformation,
    professionalInformation: professionalInformation,
    likes: likes,
    dislikes: dislikes,
    studentName: studentName,
    teacherName: teacherName,
  });
  return engineeredMessages;
}
