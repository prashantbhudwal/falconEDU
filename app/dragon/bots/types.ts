import { type Message } from "ai";
import { type User } from "@prisma/client";

export type Bot = {
  id: string;
  userId: string;
  messages: Message[];
  createdAt: Date;
};


