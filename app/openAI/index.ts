import { OpenAIApi, Configuration } from "openai";
import { ChatCompletionRequestMessage } from "openai";
import { options } from "./options";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const model = new OpenAIApi(configuration);
const { MODEL, TEMPERATURE, MAX_TOKENS } = options;

export default async function getCompletion(
  messages: ChatCompletionRequestMessage[]
) {
  const completion = await model.createChatCompletion({
    model: MODEL,
    temperature: TEMPERATURE,
    max_tokens: MAX_TOKENS,
    messages: messages,
  });
  return completion.data;
}
