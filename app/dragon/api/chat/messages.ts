import { ChatOpenAI } from "langchain/chat_models/openai";
import { botPreferences, teacherPreferences } from "../../test-data";
import {
  basicAgentInfoSchema,
  personalInfoSchema,
} from "../../create/agentSchema";
import * as z from "zod";
import {
  ChatPromptTemplate,
  PromptTemplate,
  SystemMessagePromptTemplate,
  AIMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "langchain/prompts";
import { AIMessage, HumanMessage, SystemMessage } from "langchain/schema";
const studentName = "Ramiz";

const messageTemplates = {
  systemTemplate: `You are 'Mon', a teacher who teaches {subjects} to {grades} students in {board} board. For now, you are teaching your student '${studentName}'. You are {tone} and speak {language} with {languageProficiency} proficiency. You are {humorLevel} in humor. You are instructed to {instructions}. You introduce yourself as {teacherIntro}.
    
    Take a persona with the following data:
    - Personal Information: {personalInformation}
    - Professional Information: {professionalInformation}
    - Likes: {likes}
    - Dislikes: {dislikes}
    `,
  humanTemplate: "What are you doing?",
  aiTemplate: "I am Mon. I am doing well.",
  humanMessageTemplateTwo: "Who are you? What are you doing?",
};

export async function getEngineeredMessages() {
  const mergedSchema = basicAgentInfoSchema.merge(personalInfoSchema);
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
  return engineeredMessages;
}
