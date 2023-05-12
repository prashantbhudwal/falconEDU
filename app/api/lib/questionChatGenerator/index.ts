import { QuestionPayload } from "@/types";
import { ChatCompletionRequestMessage } from "openai";

const skipIntroduction = `Do not refer to yourself in your answers. Or give any introductory text. Do not say stuff like "As an AI language model..." or "Sure, here is ..."`;

const SHORT_RESPONSES = `Keep your answers concise, as short as possible.`;
function getEngineeredMessages(
  grade: string,
  topic: string,
  subtopic: string,
  board: string,
  subject: string
): ChatCompletionRequestMessage[] {
  return [
    {
      role: "system",
      content: `You are a question generator that generates question at a particular "Bloom Level" for children. You always reply in JSON. Here is a sample JSON response: 
      {
      "question": <question>,
      "type":<questionType>,
      "options": <options>,
      "bloomLevel": <level>
      "levelExplanation":<whyLevelWasAssigned>,
      "correctOption":<correctOption>,
      "sampleAnswer":<sampleAnswer>,
      "topic":<topic>,
      "subtopic":<subtopic>,
      "grade":<grade>,
      "curriculum":<curriculum>
      }
`,
    },
  ];
}

export function getQuestionMessages(
  payload: QuestionPayload
): ChatCompletionRequestMessage[] {
  const { grade, topic, subtopic, board, questionType, bloomLevel, subject } =
    payload.data;
  const engineeredMessages = getEngineeredMessages(
    grade,
    topic,
    subtopic,
    board,
    subject
  );

  switch (questionType) {
    case "fillInTheBlanks":
      return [
        ...engineeredMessages,
        {
          role: "user",
          content: `Give me one question {
    "question": <question>,
    "type": "fillInTheBlanks",
    "options": <options>,
    "bloomLevel": "${bloomLevel}",
    "levelExplanation":<whyLevelWasAssigned>,
    "correctOption": <correctOption>,
    "sampleAnswer": <SampleAnswer>,
    "topic": "${topic}",
    "subtopic": "${subtopic}",
    "grade": "${grade}",
    "curriculum": "${board}"
    }`,
        },
      ];
    case "multipleChoiceSingleCorrect":
      return [
        ...engineeredMessages,
        {
          role: "user",
          content: `Describe a real-world application of the topic "${subtopic}", that students can relate to. ${SHORT_RESPONSES} ${skipIntroduction}`,
        },
      ];
    case "trueFalse":
      return [
        ...engineeredMessages,
        {
          role: "user",
          content: `Explain one counterexample that helps students differentiate between correct and incorrect understanding of: ${subtopic}. ${SHORT_RESPONSES} ${skipIntroduction}`,
        },
      ];
    case "shortAnswer":
      return [
        ...engineeredMessages,
        {
          role: "user",
          content: `Compare and contrast this topic with other closely related topics to help students distinguish between them: ${subtopic}. ${SHORT_RESPONSES} ${skipIntroduction}`,
        },
      ];
    case "essay":
      return [
        ...engineeredMessages,
        {
          role: "user",
          content: `Design a 5-question MCQ quiz that targets the core ideas and principles of: ${subtopic}, ensuring students grasp the most important aspects. Give answers at the end. ${SHORT_RESPONSES} ${skipIntroduction}`,
        },
      ];
    default:
      return [
        ...engineeredMessages,
        {
          role: "user",
          content: `Provide an example that clarifies the topic for students: ${subtopic}. ${SHORT_RESPONSES} ${skipIntroduction}`,
        },
      ];
  }
}
