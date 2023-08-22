import { QuestionBank, QuestionBankPayload, QuestionObject } from "@/types";
import { type ChatCompletionRequestMessage } from "openai-edge";
function getEngineeredMessages(): ChatCompletionRequestMessage[] {
  return [
    {
      role: "system",
      content: `TASK: Generate worksheet answer-key from the question bank. The question bank is formatted as an object. Reply as plain text. Worksheet only.`,
    },
  ];
}
export function filterEmptyQuestions(questionBank: QuestionBank): QuestionBank {
  return questionBank.filter((qo: QuestionObject) => qo.questions.length !== 0);
}
export function getWorksheetAnswersMessages(
  payload: QuestionBankPayload
): ChatCompletionRequestMessage[] {
  const questionBank = payload.data;
  const filteredQuestionBank = filterEmptyQuestions(questionBank);
  const questionBankString = JSON.stringify(filteredQuestionBank);
  const engineeredMessages = getEngineeredMessages();
  return [
    ...engineeredMessages,
    {
      role: "user",
      content: `DON'T Reply in JSON. Reply only with the answer key. Each question type should be in its own section. ${questionBankString}`,
    },
  ];
}
