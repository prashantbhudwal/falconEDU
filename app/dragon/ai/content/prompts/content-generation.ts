import { getFormattedGrade } from "@/app/dragon/teacher/utils";
import { ChatCompletionMessageParam } from "openai/resources";
import { ContentAPIRequestBody } from "../route";
import endent from "endent";

const getMessagesForLesson = (
  context: ContentAPIRequestBody,
): ChatCompletionMessageParam[] => {
  const { topic, subjects, grade } = context;
  const formattedGrade = getFormattedGrade({
    grade,
    options: {
      numberOnly: true,
    },
  });
  const formattedSubjects = subjects.join(", ");
  return [
    {
      role: "system",
      content: endent`You are an educational content creator. The teacher will provide you with the context about the lesson and you will generate the content. The content should be appropriate for students in ${formattedGrade} grade.

      The students live in India and are learning ${formattedSubjects}.

      The language of instruction is English. However note that the students are not native English speakers. The content should be simple and easy to understand.

      The style of writing should be like that in a textbook.

      `,
    },
    {
      role: "user",
      content: `Give me content for teaching the topic - ${topic} to students in ${formattedGrade} grade.
      Content: \n,
      `,
    },
  ];
};

const getMessagesForAITest = (
  context: ContentAPIRequestBody,
): ChatCompletionMessageParam[] => {
  const { topic, subjects, grade } = context;
  const formattedGrade = getFormattedGrade({
    grade,
    options: {
      numberOnly: true,
    },
  });
  const formattedSubjects = subjects.join(", ");
  return [
    {
      role: "system",
      content: endent`You are an educational content creator. The teacher will provide you with the context about the lesson and you will generate the content. The content should be appropriate for students in ${formattedGrade} grade.

      The students live in India and are learning ${formattedSubjects}.

      The language of instruction is English. However note that the students are not native English speakers. The content should be simple and easy to understand.

      The style of writing should be like that in a textbook.

      `,
    },
    {
      role: "user",
      content: `Give me content for teaching the topic - ${topic} to students in ${formattedGrade} grade.
      Content: \n,
      `,
    },
  ];
};

const getMessagesForChat = (
  context: ContentAPIRequestBody,
): ChatCompletionMessageParam[] => [
  {
    role: "user",
    content: `Make this simpler
        ${prompt}
        Output:\n`,
  },
];

const getMessagesForTest = (
  context: ContentAPIRequestBody,
): ChatCompletionMessageParam[] => [
  {
    role: "user",
    content: `Make this simpler
        ${prompt}
        Output:\n`,
  },
];

export const contentMessagesMap = {
  lesson: getMessagesForLesson,
  "ai-test": getMessagesForAITest,
  chat: getMessagesForChat,
  test: getMessagesForTest,
} as const;

export const getContentGenerationMessages = (
  context: ContentAPIRequestBody,
): ChatCompletionMessageParam[] => {
  const { type } = context;
  const messageGenerator = contentMessagesMap[type];
  const engineeredMessages = messageGenerator(context);
  return engineeredMessages;
};
