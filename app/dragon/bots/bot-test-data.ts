import { type Bot } from "./types";
import { type User } from "@prisma/client";
const bots: Bot[] = [
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

export default bots;
