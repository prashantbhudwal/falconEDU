import { OpenAIApi, Configuration } from "openai";
import { ChatCompletionRequestMessage } from "openai";
import { options } from "./options";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const model = new OpenAIApi(configuration);

export default async function getCompletion(
  messages: ChatCompletionRequestMessage[]
) {
  const { MODEL, TEMPERATURE, MAX_TOKENS } = options;
  const completion = await model.createChatCompletion({
    model: MODEL,
    temperature: TEMPERATURE,
    max_tokens: MAX_TOKENS,
    messages: messages,
  });
  return completion.data;
}

export async function getCompletionStream(
  messages: ChatCompletionRequestMessage[]
) {
  const { MODEL, TEMPERATURE, MAX_TOKENS, STREAM } = options;
  const completion = await model.createChatCompletion(
    {
      model: MODEL,
      temperature: TEMPERATURE,
      max_tokens: MAX_TOKENS,
      messages: messages,
      stream: STREAM,
    },
    { responseType: "stream" }
  );
  return completion;
}
