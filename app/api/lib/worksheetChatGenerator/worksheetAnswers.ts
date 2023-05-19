import { QuestionBankPayload } from "@/types";
import { ChatCompletionRequestMessage } from "openai";

function getEngineeredMessages(): ChatCompletionRequestMessage[] {
  return [
    {
      role: "system",
      content: `TASK: Generate worksheet answer-key from the question bank. The question bank is formatted as an object. Reply as plain text. Worksheet only.`,
    },
  ];
}

export function getWorksheetAnswersMessages(
  payload: QuestionBankPayload
): ChatCompletionRequestMessage[] {
  const questionBank = payload.data;
  const questionBankString = JSON.stringify(questionBank);
  const engineeredMessages = getEngineeredMessages();
  return [
    ...engineeredMessages,
    {
      role: "user",
      content: `Reply only with the answer key. Each question type should be in its own section. ${questionBankString}`,
    },
  ];
}
