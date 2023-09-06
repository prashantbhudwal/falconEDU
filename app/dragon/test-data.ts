import { type Bot } from "./bots/types";
import { type User } from "@prisma/client";
import { personalInfoSchema, basicAgentInfoSchema } from "./create/agentSchema";
export const agentData = {
  id: "111",
  userId: "1234",
  name: "John Doe",
  email: "",
  grade: "Grade 3",
  subjects: ["Math", "Science"],
  curriculum: "CBSE",
  config: {},
};
import * as z from "zod";

export const agentDataArray = [
  agentData,
  { ...agentData, id: "222" },
  { ...agentData, id: "333" },
  { ...agentData, id: "444" },
  { ...agentData, id: "555" },
  { ...agentData, id: "666" },
];

export type AgentTestData = typeof agentData;

export const bots: Bot[] = [
  {
    id: "pIfxItK",
    userId: "clkg7xo0i0000ic087iyx39fd",
    messages: [
      {
        id: "msg1",
        role: "system",
        content: 'You are a teaching assistant named "Chubbi".',
        createdAt: new Date("2023-09-05T21:19:19.000Z"),
      },
      {
        id: "msg2",
        role: "user",
        content: "What else can you do?",
        createdAt: new Date("2023-09-05T21:19:20.000Z"),
      },
    ],
    createdAt: new Date("2023-09-05T21:19:19.000Z"),
  },
  {
    id: "HTfXtIq",
    userId: "clkg7xo0i0000ic087iyx39fd",
    messages: [
      {
        id: "msg3",
        role: "system",
        content: 'You are a teaching assistant named "Chubbi".',
        createdAt: new Date("2023-09-05T21:18:48.000Z"),
      },
      {
        id: "msg4",
        role: "user",
        content: "What are you doing?",
        createdAt: new Date("2023-09-05T21:18:49.000Z"),
      },
    ],
    createdAt: new Date("2023-09-05T21:18:48.000Z"),
  },
];

export const botPreferences: Array<z.infer<typeof basicAgentInfoSchema>> = [
  {
    instructions: "Be clear and concise.",
    teacherIntro: "I specialize in English literature.",
    subjects: ["English"],
    grades: ["Grade 1", "Grade 2", "Grade 3"],
    board: "ICSE",
    tone: "Friendly",
    language: "English",
    humorLevel: "Low",
    languageProficiency: "Advanced",
  },
  {
    instructions: "Encourage participation.",
    teacherIntro: "I love making math fun!",
    subjects: ["Math", "Science"],
    grades: ["Grade 1", "Grade 2"],
    board: "CIE",
    tone: "Friendly",
    language: "English",
    humorLevel: "High",
    languageProficiency: "Beginner",
  },
  {
    instructions: "Avoid off-topic discussions.",
    teacherIntro: "Focused on Physics and Chemistry.",
    subjects: ["Science"],
    grades: ["Grade 3", "Grade 4"],
    board: "CBSE",
    tone: "Strict",
    language: "English",
    humorLevel: "Low",
    languageProficiency: "Advanced",
  },
];

export const teacherPreferences: Array<z.infer<typeof personalInfoSchema>> = [
  {
    personalInformation: "I enjoy classical music and hiking during weekends.",
    professionalInformation:
      "Master's in Computer Science, teaching for 5 years.",
    likes: "Interactive sessions, student engagement.",
    dislikes: "Late submissions, disinterest in learning.",
  },
  {
    personalInformation: "Love reading research papers and cooking Italian.",
    professionalInformation: "PhD in Machine Learning, published 20+ papers.",
    likes: "Research discussions, innovative ideas.",
    dislikes: "Plagiarism, off-topic chats.",
  },
  {
    personalInformation: "Passionate about cycling and blogging.",
    professionalInformation:
      "10 years in software industry, 3 years in teaching.",
    likes: "Real-world applications, problem-solving.",
    dislikes: "Lack of practicality, missing deadlines.",
  },
];
