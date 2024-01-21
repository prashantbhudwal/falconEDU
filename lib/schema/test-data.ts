import {
  StudentPreferenceSchema,
  botPreferencesSchema,
  lessonPreferencesSchema,
  teacherPreferencesSchema,
} from "@/lib/schema";
import { type Bot } from "../../app/dragon/student/types";

export const botData = {
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

export const botDataArray = [
  botData,
  { ...botData, id: "222" },
  { ...botData, id: "333" },
  { ...botData, id: "444" },
  { ...botData, id: "555" },
  { ...botData, id: "666" },
];

export type BotTestData = typeof botData;

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

export const botPreferences: Array<z.infer<typeof botPreferencesSchema>> = [
  {
    instructions: "Be clear and concise.",
    tone: "Friendly",
    language: "English",
    humorLevel: "Low",
    languageProficiency: "Advanced",
  },
  {
    instructions: "Encourage participation.",

    tone: "Friendly",
    language: "English",
    humorLevel: "High",
    languageProficiency: "Beginner",
  },
  {
    instructions: "Avoid off-topic discussions.",

    tone: "Strict",
    language: "English",
    humorLevel: "Low",
    languageProficiency: "Advanced",
  },
];

export const lessonPreferences: Array<z.infer<typeof lessonPreferencesSchema>> =
  [
    {
      content: "Be clear and concise.",
      topic: "English",
      subjects: ["English"],

      tone: "Friendly",
      language: "English",
      humorLevel: "Low",
      languageProficiency: "Advanced",
    },
    {
      content: "Be clear and concise.",
      topic: "English",
      subjects: ["Math", "Science"],

      tone: "Friendly",
      language: "English",
      humorLevel: "High",
      languageProficiency: "Beginner",
    },
    {
      content: "Be clear and concise.",
      topic: "English",
      subjects: ["Science"],

      tone: "Strict",
      language: "English",
      humorLevel: "Low",
      languageProficiency: "Advanced",
    },
  ];

export const AITestPreferences: Array<z.infer<typeof lessonPreferencesSchema>> =
  [
    {
      content: "Be clear and concise.",
      topic: "English",
      subjects: ["English"],

      tone: "Friendly",
      language: "English",
      humorLevel: "Low",
      languageProficiency: "Advanced",
    },
    {
      content: "Be clear and concise.",
      topic: "English",
      subjects: ["Math", "Science"],

      tone: "Friendly",
      language: "English",
      humorLevel: "High",
      languageProficiency: "Beginner",
    },
    {
      content: "Be clear and concise.",
      topic: "English",
      subjects: ["Science"],

      tone: "Strict",
      language: "English",
      humorLevel: "Low",
      languageProficiency: "Advanced",
    },
  ];

export const teacherPreferences: Array<
  z.infer<typeof teacherPreferencesSchema>
> = [
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

export const studentPreferences: Array<
  z.infer<typeof StudentPreferenceSchema>
> = [
  {
    aboutYourself: "",
    interests: "",
    favoriteCartoons: "",
    favoriteFoods: "",
  },
];
