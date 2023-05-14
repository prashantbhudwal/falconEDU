import { QuestionPayload, QuestionType } from "@/types";
import { ChatCompletionRequestMessage } from "openai";

const JSON_DIRECTIVE = "Only respond with JSON.";

function getQuestionTypePrompt(questionType: string) {
  switch (questionType) {
    case "fillInTheBlanks":
      return "Generate a '''fill in the blank question'''.";
    case "multipleChoiceSingleCorrect":
      return "Generate a '''multiple choice question with a single correct answer'''.";
    case "trueFalse":
      return "Generate a '''true or false question'''.";
    case "shortAnswer":
      return "Generate a '''short answer type question'''.";
    case "essay":
      return "Generate a '''essay type'''.";
    default:
      throw new Error("Invalid question type");
  }
}

function getQuestionResponseFormat(questionType: QuestionType): string {
  switch (questionType) {
    case "trueFalse":
      return `{"type":"trueFalse","question":<question>}`;
    case "fillInTheBlanks":
      return `{"type":"fillInTheBlanks","question":<question>}`;
    case "multipleChoiceSingleCorrect":
      return `{"type":"multipleChoiceSingleCorrect","question":<question>, "options":<options>, "answer":<correctOption>}`;
    case "shortAnswer":
      return `{"type":"shortAnswer","question":<question>}`;
    case "essay":
      return `{"type":"essay","question":<question>}`;
    default:
      throw new Error("Invalid question type");
  }
}

function getBloomLevelPrompt(bloomLevel: string | undefined): string {
  const lowerCaseBloomLevel = bloomLevel?.toLowerCase();
  switch (lowerCaseBloomLevel) {
    case "remember":
      return "Remembering";
    case "understand":
      return "Understanding";
    case "apply":
      return "Applying";
    case "analyze":
      return "Analyzing";
    case "evaluate":
      return "Evaluating";
    case "create":
      return "Creating";
    default:
      throw new Error("Invalid bloom level");
  }
}

function getSystemMessage(
  payload: QuestionPayload
): ChatCompletionRequestMessage[] {
  return [
    {
      role: "system",
      content: `Generate questions for a school worksheet. ${JSON_DIRECTIVE}`,
    },
  ];
}

function getInitialUserMessage(payload: QuestionPayload): string {
  const { bloomLevel, topic, subtopic, grade, board, type } = payload.data;
  const prompt_QuestionType = getQuestionTypePrompt(type);
  const prompt_BloomLevel = getBloomLevelPrompt(bloomLevel);
  const questionFormat = getQuestionResponseFormat(type);
  return `${prompt_QuestionType} The question should be for the topic "${subtopic}" from the chapter "${topic}". The students are in grade ${grade} and they are prescribed, """${board}""" Textbook. Make sure you adhere to """Bloom's taxonomy""", and give the the question at the Bloom level of '''${prompt_BloomLevel}'''. Don't mention the textbook, or bloom level in the response. Reply with ONLY JSON in the following format: ${questionFormat}`;
}

export function getQuestionMessages(
  payload: QuestionPayload
): ChatCompletionRequestMessage[] {
  const questionType = payload.data.type;
  const systemMessage = getSystemMessage(payload);
  const initialUserMessage = getInitialUserMessage(payload);
  switch (questionType) {
    case "fillInTheBlanks":
      return [
        ...systemMessage,
        {
          role: "user",
          content: initialUserMessage,
        },
      ];
    case "multipleChoiceSingleCorrect":
      return [
        ...systemMessage,
        {
          role: "user",
          content: initialUserMessage,
        },
      ];
    case "trueFalse":
      return [
        ...systemMessage,
        {
          role: "user",
          content: initialUserMessage,
        },
      ];
    case "shortAnswer":
      return [
        ...systemMessage,
        {
          role: "user",
          content: initialUserMessage,
        },
      ];
    case "essay":
      return [
        ...systemMessage,
        {
          role: "user",
          content: initialUserMessage,
        },
      ];
    default:
      return [
        ...systemMessage,
        {
          role: "user",
          content: ``,
        },
      ];
  }
}

function getJsonPayload(payload: QuestionPayload): string {
  const { bloomLevel, topic, subtopic, grade, board, type } = payload.data;

  let basePayload = {
    question: "<question>",
    type: type,
    bloomLevel,
    // levelExplanation: "<whyLevelWasAssigned>",
    topic,
    subtopic,
    grade,
    curriculum: board,
  };

  let specificPayload;

  switch (type) {
    case "fillInTheBlanks":
      specificPayload = {
        ...basePayload,
        answer: "<correctOption>",
      };
      break;
    case "multipleChoiceSingleCorrect":
    case "trueFalse":
      specificPayload = {
        ...basePayload,
        options: "<options>",
        answer: "<correctOption>",
      };
      break;
    case "shortAnswer":
    case "essay":
      specificPayload = {
        ...basePayload,
        answer: "<SampleAnswer>",
      };
      break;
    default:
      throw new Error("Invalid question type");
  }

  return JSON.stringify(specificPayload);
}
