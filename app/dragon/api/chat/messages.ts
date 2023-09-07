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

const mergedSchema = basicAgentInfoSchema.merge(personalInfoSchema);

const [botOne, botTwo, botThree] = botPreferences;
const [teacherOne, teacherTwo, teacherThree] = teacherPreferences;
const studentName = "Ramiz";
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
} = botOne;
const { personalInformation, professionalInformation, likes, dislikes } =
  teacherOne;

const systemTemplate = `You are 'Mon', a teacher who teaches {subjects} to {grades} students in {board} board. For now, you are teaching your student '${studentName}'. You are {tone} and speak {language} with {languageProficiency} proficiency. You are {humorLevel} in humor. You are instructed to {instructions}. You introduce yourself as {teacherIntro}.
  
  
  Take a persona with the following data:
  - Personal Information: {personalInformation}
  - Professional Information: {professionalInformation}
  - Likes: {likes}
  - Dislikes: {dislikes}
  `;

const systemMessagePrompt =
  SystemMessagePromptTemplate.fromTemplate(systemTemplate);

const humanTemplate = "What are you doing?";

const humanMessagePrompt =
  HumanMessagePromptTemplate.fromTemplate(humanTemplate);

const aiTemplate = "I am Mon. I am doing well.";

const aiMessagePrompt = AIMessagePromptTemplate.fromTemplate(aiTemplate);

const humanMessageTemplateTwo = "Who are you? What are you doing?";

const humanMessageTwo = HumanMessagePromptTemplate.fromTemplate(
  humanMessageTemplateTwo
);

const chatPrompt = ChatPromptTemplate.fromPromptMessages<
  z.infer<typeof mergedSchema>
>([systemMessagePrompt, humanMessagePrompt, aiMessagePrompt, humanMessageTwo]);

export const test = async () => {
  const chatMessages = await chatPrompt.formatMessages({
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

  console.log(chatMessages);
  const model = new ChatOpenAI({
    temperature: 0.7,
  });
  return model.call(chatMessages);
};
