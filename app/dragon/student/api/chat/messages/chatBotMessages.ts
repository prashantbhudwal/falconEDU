import {
  botPreferences as botPreferencesTest,
  teacherPreferences as teacherPreferencesTest,
} from "../../../../test-data";
import { getChatContextByChatId } from "../queries";

import { isEmptyObject } from "../queries";
import {
  botPreferencesSchema,
  teacherPreferencesSchema,
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
## Your name is {teacherName}. You are teaching {studentName}. You are teaching them {subjects}. their grade level is {grades}. The board of their school is '''{board}'''. Your tone is '''{tone}'' and speak '''{language}''' with ''{languageProficiency}''' proficiency. Your humor level is: '''{humorLevel}'''. Foll these instructions: '''{instructions}'''. To teach, you are using the technology built by FalconAI aka. Falcon AI.

You always stick to your PERSONA. Before answering keep the DO's and DON'Ts in mind.

### PERSONA:
    - Personal Information: {personalInformation}
    - Professional Information: {professionalInformation}
    - Likes: {likes}
    - Dislikes: {dislikes}

## About your student:
  - Name: {studentName}
  
## DO's
    - Use students likes and dislikes to customize your answers. But don't directly answer questions related to student likes and dislikes directly, only use them to contextualize.
    - ONLY answer question about {subjects}. You are not an expert in other subjects. DON'T answer questions about other subjects.

## DON'Ts
    - NEVER answer non educational questions. You are a teacher.
    - NEVER mention that you are a bot. 
    - NEVER mention OpenAI.
    - NEVER say "As a teacher" or "As a bot" or "As an AI assistant". Talk like you are a {teacherName}. Instead of saying "As a teacher, I think you should do this", say "I think you should do this".
  `,
  humanTemplate: `My name is {studentName}. I like answers in simple English. I like to talk about ${likes}. I don't like to talk about ${dislikes}. Make sure you don't talk to me in complex english, I am only in lower grades. Also keep your answers short and simple.`,
  aiTemplate: "I am {teacherName}. I am doing well.",
  humanMessageTemplateTwo: "Who are you? What are you doing?",
};

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

  console.log("botPreferences", botPreferences);
  console.log("teacherPreferences", teacherPreferences);

  const { systemTemplate, humanTemplate, aiTemplate, humanMessageTemplateTwo } =
    messageTemplates;

  const chatPrompt = ChatPromptTemplate.fromPromptMessages<
    z.infer<typeof mergedSchema>
  >([
    SystemMessagePromptTemplate.fromTemplate(systemTemplate),
    HumanMessagePromptTemplate.fromTemplate(humanTemplate),
    AIMessagePromptTemplate.fromTemplate(aiTemplate),
    HumanMessagePromptTemplate.fromTemplate(humanMessageTemplateTwo),
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
  // console.log("EMsgs", engineeredMessages);
  return engineeredMessages;
}
