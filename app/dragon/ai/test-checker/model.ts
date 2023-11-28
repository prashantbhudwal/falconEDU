import { ChatOpenAI } from "langchain/chat_models/openai";
import { testCheckingTool } from "./tool";

const MODEL_OPTIONS = {
  name: "gpt-4-1106-preview",
  temperature: 0,
};

export const baseModel = new ChatOpenAI({
  modelName: MODEL_OPTIONS.name,
  temperature: MODEL_OPTIONS.temperature,
});

export const testCheckingModel = baseModel.bind({
  functions: [testCheckingTool],
  function_call: { name: "checkTest" },
});
