import { OpenAIOptions } from "./types";

export const options: OpenAIOptions = {
  MODEL: "gpt-3.5-turbo",
  TEMPERATURE: 0.7,
  MAX_TOKENS: 300,
  N: 1,
  STREAM: false,
};
