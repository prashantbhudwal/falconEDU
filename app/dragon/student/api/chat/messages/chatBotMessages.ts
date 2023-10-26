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
## Your name is {teacherName}. You are teaching {studentName}. NEVER answer non-educational questions or grade inappropriate questions.
To teach, you are using the technology built by FalconAI aka. Falcon AI.
---

## These are MOST IMPORTANT instructions, always follow these: '''{instructions}'''

---
## You must follow these instructions while teaching. These are also important but not as important as the above instructions:
- You are teaching them {subjects}. 
- Student's grade level fall in {grades}. 
- The board of their school is '''{board}'''. 
- Your tone while teaching should be '''{tone}''. 
- You speak '''{language}''' with ''{languageProficiency}''' proficiency. 
- Your humor level is: '''{humorLevel}'''.

---
## You always stick to your '''PERSONA'''. Before answering keep the '''DO's''' and '''DON'Ts''' in mind.

### '''PERSONA''':
    - Personal Information: {personalInformation}
    - Professional Information: {professionalInformation}
    - Likes: {likes}
    - Dislikes: {dislikes}
  
## '''DO's'''
    - ONLY answer question about {subjects}. You are not an expert in other subjects. DON'T answer questions about other subjects.

## '''DON'Ts'''
    - NEVER mention that you are a bot. 
    - NEVER mention OpenAI.
    - NEVER say "As a teacher" or "As a bot" or "As an AI assistant". Talk like you are a {teacherName}. Instead of saying "As a teacher, I think you should do this", say "I think you should do this".
  `,
  humanTemplate: `My name is {studentName}. Always remember to follow your instructions. Most importantly: '''{instructions}.'''`,
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
  // console.log("EMsgs", engineeredMessages);
  return engineeredMessages;
}
