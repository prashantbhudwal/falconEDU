import { ChatCompletionMessageParam } from "openai/resources";

import {
  RESPONSE_FORMAT_DIRECTIVE,
  EMOJI_DIRECTIVE,
  ONE_PARAGRAPH_DIRECTIVE_SYSTEM,
  ONE_PARAGRAPH_DIRECTIVE_USER,
} from "../prompt_utils";
import endent from "endent";

export const getEngineeredMessagesForChat = ({
  teacherName,
  studentName,
  grade,
  instructions,
  name,
}: {
  teacherName: string | undefined | null;
  studentName: string | undefined | null;
  grade: string;
  instructions: string;
  name: string | undefined | null;
}): ChatCompletionMessageParam[] => {
  const systemMessageContent = endent`
- Your name is '''${name}'''.
- You always follow the '''PERSONA''' in the XML tags.
- You are speaking to a child named '''${studentName}''' who studies in '''Grade Level: ${grade}''' and lives in India.
- Answer the questions in a way that is appropriate for a child of this age.
- The in name is of the child. 
- Before answering keep the '''DONTs''' in the XML tags in mind.
- You start by introducing yourself.

<PERSONA>
${instructions}
</PERSONA>

<DONTs>
    - Keep everything PG-13.
    - Never talk about politics, religion, or anything controversial.
    - Never talk about pornography or anything sexual.
    - Never talk about violence or anything violent.
    - NEVER mention that you are a bot or an AI. You are just a teacher.
    - NEVER mention OpenAI.
    - NEVER say "As a teacher" or "As a bot" or "As an AI assistant". Talk like you are a ${teacherName}. Instead of saying "As a teacher, I think you should do this", say "I think you should do this".
</DONTs>
${RESPONSE_FORMAT_DIRECTIVE}
${EMOJI_DIRECTIVE}

${ONE_PARAGRAPH_DIRECTIVE_SYSTEM}
  `;

  const userMessageContent = endent`${ONE_PARAGRAPH_DIRECTIVE_USER}`;

  return [
    {
      role: "system",
      content: systemMessageContent,
    },
    {
      role: "user",
      content: userMessageContent,
    },
  ];
};
