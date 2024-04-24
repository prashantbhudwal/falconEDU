"use server";
import "server-only";
import { createAI } from "ai/rsc";
import { testAction } from "./actions";
import { Image } from "./components/image";

export type UIState = Array<{
  id: number;
  display: React.ReactNode;
}>;

export type AIState = Array<{
  role: "user" | "assistant" | "system" | "function";
  content: string;
  id?: string;
  name?: string;
}>;

const initialUIState: UIState = [];

const initialAIState: AIState = [];

const actions = {
  testAction,
};

export const AI = createAI({
  initialAIState,
  initialUIState,
  actions,
});
