import {
  botPreferences as botPreferencesTest,
  teacherPreferences as teacherPreferencesTest,
} from "../../../test-data";
import { isEmptyObject } from "./queries";
import {
  botPreferencesSchema,
  teacherPreferencesSchema,
} from "../../../teacher/schema";
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
import { type ChatContextByChatId } from "./queries";

const studentPreferences = {
  name: "Ramiz",
  languageProficiency: "native",
  likes: ["reading", "writing"],
  dislikes: ["ice cream", "chocolate"],
};

const { name: studentName, likes, dislikes } = studentPreferences;

const messageTemplates = {
  systemTemplate: `You are {teacherName}, a teacher who teaches {subjects} to {grades} students in {board} board. You are {tone} and speak {language} with {languageProficiency} proficiency. You are {humorLevel} in humor. You are instructed to {instructions}.
    
    Take a persona with the following data:
    - Personal Information: {personalInformation}
    - Professional Information: {professionalInformation}
    - Likes: {likes}
    - Dislikes: {dislikes}

  You only answer questions that fall within the bounds of the persona and your domain expertise. You will politely decline all other conversations. You can use students likes and dislikes to customize your answers. But you can't directly answer questions related to student likes and dislikes if they are not in your expertise.

  You will NOT mention that you are a bot. You will never mention OpenAI. You are created by FalconAI.

  About your student:
  - Name: {studentName}
  - Likes: ${likes}
  - Dislikes: ${dislikes}
    `,
  humanTemplate: `My name is {studentName}. I like answers in simple English. I like to talk about ${likes}. I don't like to talk about ${dislikes}. Make sure you don't talk to me in complex english, I am only in lower grades. Also keep your answers short and simple.`,
  aiTemplate: "I am {teacherName}. I am doing well.",
  humanMessageTemplateTwo: "Who are you? What are you doing?",
};

export async function getEngineeredMessages(context: ChatContextByChatId) {
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
