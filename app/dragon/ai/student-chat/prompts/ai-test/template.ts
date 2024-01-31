import {
  ChatCompletionMessageParam,
  ChatCompletionSystemMessageParam,
} from "openai/resources";
import {
  RESPONSE_FORMAT_DIRECTIVE,
  EMOJI_DIRECTIVE,
  ONE_PARAGRAPH_DIRECTIVE_SYSTEM,
  ONE_PARAGRAPH_DIRECTIVE_USER,
} from "../common/directives";

import { HINDI_DIRECTIVE } from "../common/directives";
import endent from "endent";

type AITestSystemMessageProps = {
  studentName: string | undefined | null;
  grade: string;
  aboutYourself: string | undefined;
  favoriteCartoons: string | undefined;
  favoriteFoods: string | undefined;
  interests: string | undefined;
  topic: string;
  subjects: string;
  content: string;
  mediumOfInstruction: string | undefined;
};

export const getEngineeredMessages = ({
  studentName,
  grade,
  aboutYourself,
  favoriteCartoons,
  favoriteFoods,
  interests,
  topic,
  subjects,
  content,
  mediumOfInstruction,
}: AITestSystemMessageProps): ChatCompletionMessageParam[] => {
  const studentDetails = endent`
<studentDetails>
  - Name: '''${studentName}'''
  - ${studentName} lives in India.
  - About me: '''${aboutYourself}'''
  - Favorite cartoons: '''${favoriteCartoons}'''
  - Favorite foods: '''${favoriteFoods}'''
  - Interests: '''${interests}'''
</studentDetails>
`;
  const medium = mediumOfInstruction ? mediumOfInstruction : "english";

  const rulesForQuiz = endent`
  -  Always ask the questions socratic-ly, one by one. When the quizzing is complete ask the student to submit.
  -  Make the student feel comfortable and engaged.
  -  Never ask all the questions at once.
  -  Never ask questions that are not in the scope of "SUBJECT MATTER" provided to you.
  -  Adjust the difficulty of the questions based on the student's responses.
  -  Praise the student when they answer correctly.
  -  Give feedback when the student answers incorrectly.
  -  Make sure the student understands the feedback.
  `;

  const contentForQuiz = endent`
  Topic: ${topic}
  Grade Level: ${grade}
  Subject: ${subjects}
  Content:${content}
  `;

  const systemMessageContent = `${medium === "hindi" ? HINDI_DIRECTIVE : ""} You administer quizzes. You quiz students by asking them questions one one after the another. Your aim is to check the student's understanding of the "SUBJECT MATTER" provided to you. 

How to conduct the quiz:
You carefully consider the content. You then craft questions based on the "SUBJECT MATTER" provided to you. While quizzing, You always follow the "RULES".

"RULES" START HERE
${rulesForQuiz}
"RULES" END HERE

"SUBJECT MATTER" STARTS HERE
${contentForQuiz}
"SUBJECT MATTER" ENDS HERE
---

---
${RESPONSE_FORMAT_DIRECTIVE}
${EMOJI_DIRECTIVE}
${ONE_PARAGRAPH_DIRECTIVE_SYSTEM}
Use "submit_test" function to submit the quiz. 
`;

  const engineeredMessages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: systemMessageContent,
    },
  ];

  return engineeredMessages;
};
