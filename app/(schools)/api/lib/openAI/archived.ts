// import { OpenAI } from "openai";
// import { type ChatCompletionRequestMessage } from "openai-edge";
// import { ideaOptions, lessonOptions } from "./options";

// const model = new OpenAI();

// export default async function getCompletion(
//   messages: ChatCompletionRequestMessage[]
// ) {
//   const { MODEL, TEMPERATURE, MAX_TOKENS } = ideaOptions;
//   const completion = await model.createChatCompletion({
//     model: MODEL,
//     temperature: TEMPERATURE,
//     max_tokens: MAX_TOKENS,
//     messages: messages,
//   });
//   return completion.data;
// }

// export async function getCompletionStream(
//   messages: ChatCompletionRequestMessage[]
// ) {
//   const { MODEL, TEMPERATURE, MAX_TOKENS, STREAM } = ideaOptions;
//   const completion = await model.createChatCompletion(
//     {
//       model: MODEL,
//       temperature: TEMPERATURE,
//       max_tokens: MAX_TOKENS,
//       messages: messages,
//       stream: STREAM,
//     },
//     { responseType: "stream" }
//   );
//   return completion;
// }

// export async function getLessonCompletionStream(
//   messages: ChatCompletionRequestMessage[]
// ) {
//   const { MODEL, TEMPERATURE, MAX_TOKENS, STREAM } = lessonOptions;
//   const completion = await model.createChatCompletion(
//     {
//       model: MODEL,
//       temperature: TEMPERATURE,
//       max_tokens: MAX_TOKENS,
//       messages: messages,
//       stream: STREAM,
//     },
//     { responseType: "stream" }
//   );
//   return completion;
// }

// export async function handleGPT3TurboStreamData(
//   data: Buffer,
//   writer: WritableStreamDefaultWriter<Uint8Array>
// ) {
//   const encoder = new TextEncoder();
//   const lines = data
//     .toString()
//     .split("\n")
//     .filter((line) => line.trim() !== "");

//   for (const line of lines) {
//     const message = line.replace(/^data: /, "");
//     if (message === "[DONE]") {
//       writer.close();
//       return;
//     }

//     try {
//       const parsed = JSON.parse(message);
//       const filteredContent = parsed.choices[0]?.delta?.content || "";

//       await writer.write(encoder.encode(filteredContent));
//     } catch (error) {
//       console.error("Could not JSON parse stream message", message, error);
//     }
//   }
// }
