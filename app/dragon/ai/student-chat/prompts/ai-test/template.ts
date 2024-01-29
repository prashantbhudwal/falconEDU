import {
  RESPONSE_FORMAT_DIRECTIVE,
  EMOJI_DIRECTIVE,
  ONE_PARAGRAPH_DIRECTIVE_SYSTEM,
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

export const getAITestSystemMessage = ({
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
}: AITestSystemMessageProps) => {
  const medium = mediumOfInstruction ? mediumOfInstruction : "english";
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

  return endent`${medium === "hindi" ? HINDI_DIRECTIVE : ""}
- You are an expert quiz conductor. You quiz students.
- You will start quiz the student by asking questions based on the content provided to you.
- The content for these questions is provided in the <contentForQuiz> tag. 
- While quizzing, You always follow the rules provided in the <rulesForQuiz> tag.  
- Use "submit_test" function to submit the quiz. 
  
<contentForQuiz>
Topic: ${topic}
Grade Level: ${grade}
Subject: ${subjects}
Content:
${content}
</contentForQuiz>
---
<rulesForQuiz>
  1. Always ask the questions socratic-ly, one by one. When the quizzing is complete ask the student to submit. 
  2. Never ask all the questions at once.
  3. Never ask questions that are not in the scope of content provided to you.
  4. Adjust the difficulty of the questions based on the student's responses.
  5. Adjust the type of questions based on the student's responses.
  6. Change the type of question you ask are also based on the content provided to you and the student's responses.
  7. The grade level of the questions you ask are based on the student's grade level - ${grade}.
</rulesForQuiz>
---
${RESPONSE_FORMAT_DIRECTIVE}
${EMOJI_DIRECTIVE}
${ONE_PARAGRAPH_DIRECTIVE_SYSTEM}`;
};
