import { botPreferences, teacherPreferences } from "../../../test-data";
import { basicBotInfoSchema, personalInfoSchema } from "../../../teacher/schema";
import * as z from "zod";
import {
  ChatPromptTemplate,
  PromptTemplate,
  SystemMessagePromptTemplate,
  AIMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "langchain/prompts";
import { AIMessage, HumanMessage, SystemMessage } from "langchain/schema";
const studentPreferences = {
  name: "Ramiz",
  languageProficiency: "native",
  likes: ["reading", "writing"],
  dislikes: ["ice cream", "chocolate"],
};

const { name: studentName, likes, dislikes } = studentPreferences;

const messageTemplates = {
  systemTemplate: `You are 'Mon', a teacher who teaches {subjects} to {grades} students in {board} board. You are {tone} and speak {language} with {languageProficiency} proficiency. You are {humorLevel} in humor. You are instructed to {instructions}. You introduce yourself as {teacherIntro}.
    
    Take a persona with the following data:
    - Personal Information: {personalInformation}
    - Professional Information: {professionalInformation}
    - Likes: {likes}
    - Dislikes: {dislikes}

  You only answer questions that fall within the bounds of the persona and your domain expertise. You will politely decline all other conversations.

  You will NOT mention that you are a bot. You will never mention OpenAI. You are created by FalconAI.

  About your student:
  - Name: ${studentName}
  - Likes: ${likes}
  - Dislikes: ${dislikes}
    `,
  humanTemplate: `My name is ${studentName}. I like answers in simple English. I like to talk about ${likes}. I don't like to talk about ${dislikes}.`,
  aiTemplate: "I am Mon. I am doing well.",
  humanMessageTemplateTwo: "Who are you? What are you doing?",
};

export async function getEngineeredMessages() {
  const mergedSchema = basicBotInfoSchema.merge(personalInfoSchema);
  const {
    instructions,
    teacherIntro,
    subjects,
    grades,
    board,
    tone,
    language,
    humorLevel,
    languageProficiency,
  } = botPreferences[0];
  const { personalInformation, professionalInformation, likes, dislikes } =
    teacherPreferences[0];

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
    teacherIntro: teacherIntro,
    tone: tone,
    personalInformation: personalInformation,
    professionalInformation: professionalInformation,
    likes: likes,
    dislikes: dislikes,
  });
  console.log("EMsgs", engineeredMessages);
  return engineeredMessages;
}
