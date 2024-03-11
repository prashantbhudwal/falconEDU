import {
  ChatCompletionMessageParam,
  ChatCompletionUserMessageParam,
} from "openai/resources";

import {
  EMOJI_DIRECTIVE,
  ONE_PARAGRAPH_DIRECTIVE_SYSTEM,
  ONE_PARAGRAPH_DIRECTIVE_USER,
  HINDI_DIRECTIVE,
  getResponseFormatDirective,
} from "../common/directives";
import endent from "endent";
import { replyInHindi } from "../common/student-messages";

export const getEngineeredMessagesForChat = ({
  teacherName,
  studentName,
  grade,
  instructions,
  name,
  mediumOfInstruction,
  hasEquations,
}: {
  teacherName: string | undefined | null;
  studentName: string | undefined | null;
  grade: string;
  instructions: string;
  name: string | undefined | null;
  mediumOfInstruction: string | undefined;
  hasEquations: boolean | undefined;
}): ChatCompletionMessageParam[] => {
  const RESPONSE_FORMAT_DIRECTIVE = getResponseFormatDirective({
    hasEquations,
  });

  const medium = mediumOfInstruction ? mediumOfInstruction : "english";

  const systemMessageContent = endent`
  ${medium === "hindi" ? HINDI_DIRECTIVE : ""}
- Your name is '''${name}'''.
- You always follow the '''PERSONA''' in the XML tags.
- You are speaking to a child named '''${studentName}''' who lives in India.
- Before answering keep the '''DONTs''' in the XML tags in mind.

<PERSONA>
${instructions}
</PERSONA>

<DONTs>
    - Keep everything PG-13.
    - Never talk about politics, religion, or anything controversial.
    - Never talk about pornography or anything sexual.
    - Never talk about violence or anything violent.
    - NEVER mention that you are a bot or an AI. You are just a guide.
    - NEVER mention OpenAI.
    - NEVER say "As a bot" or "As an AI assistant". Instead of saying "As an "X", I think you should do this", say "I think you should do this".
</DONTs>
- You start by introducing yourself.
${RESPONSE_FORMAT_DIRECTIVE}
${EMOJI_DIRECTIVE}

${ONE_PARAGRAPH_DIRECTIVE_SYSTEM}
  `;

  const userMessageContent = endent`${ONE_PARAGRAPH_DIRECTIVE_USER}`;
  const defaultUserMessage: ChatCompletionUserMessageParam = {
    role: "user",
    content: userMessageContent,
  };
  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: systemMessageContent,
    },
  ];

  medium === "hindi"
    ? messages.push(replyInHindi)
    : messages.push(defaultUserMessage);

  return messages;
};
