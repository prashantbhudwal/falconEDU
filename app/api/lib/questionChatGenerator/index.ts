import { QuestionPayload, QuestionType } from "@/types";
import { ChatCompletionRequestMessage } from "openai";

const JSON_DIRECTIVE = "You only reply in JSON.";

function getEngineeredMessages(
  payload: QuestionPayload
): ChatCompletionRequestMessage[] {
  return [
    {
      role: "system",
      content: `You are a question generator that generates question at a particular "Bloom Level" for children. ${JSON_DIRECTIVE}`,
    },
  ];
}

function getJsonPayload(payload: QuestionPayload): string {
  const { bloomLevel, topic, subtopic, grade, board, questionType } =
    payload.data;

  let basePayload = {
    question: "<question>",
    type: questionType,
    bloomLevel,
    levelExplanation: "<whyLevelWasAssigned>",
    topic,
    subtopic,
    grade,
    curriculum: board,
  };

  let specificPayload;

  switch (questionType) {
    case "fillInTheBlanks":
    case "multipleChoiceSingleCorrect":
    case "trueFalse":
      specificPayload = {
        ...basePayload,
        options: "<options>",
        correctOption: "<correctOption>",
      };
      break;
    case "shortAnswer":
    case "essay":
      specificPayload = {
        ...basePayload,
        sampleAnswer: "<SampleAnswer>",
      };
      break;
    default:
      throw new Error("Invalid question type");
  }

  return JSON.stringify(specificPayload);
}
export function getQuestionMessages(
  payload: QuestionPayload
): ChatCompletionRequestMessage[] {
  const questionType = payload.data.questionType;

  if (
    ![
      "fillInTheBlanks",
      "multipleChoiceSingleCorrect",
      "trueFalse",
      "shortAnswer",
      "essay",
    ].includes(questionType)
  ) {
    throw new Error("Invalid question type");
  }

  const engineeredMessages = getEngineeredMessages(payload);

  return [
    ...engineeredMessages,
    {
      role: "user",
      content: `${JSON_DIRECTIVE} Give me one question ${getJsonPayload(
        payload
      )}`,
    },
  ];
}
