import { ChatOpenAI } from "langchain/chat_models/openai";
import { predictChapters } from "./chapter-tool";
import { predictTopics } from "./topic-tool";

const MODEL_OPTIONS = {
  name: "gpt-3.5-turbo",
  temperature: 0,
};

export const baseModel = new ChatOpenAI({
  modelName: MODEL_OPTIONS.name,
  temperature: MODEL_OPTIONS.temperature,
});

export const topicPredictionModel = baseModel.bind({
  functions: [predictTopics],
  function_call: { name: "predictTopics" },
});

export const chapterPredictionModel = baseModel.bind({
  functions: [predictChapters],
  function_call: { name: "predictChapters" },
});
