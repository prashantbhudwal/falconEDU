import endent from "endent";

export const LATEX_DIRECTIVE = endent`
## Always give math in latex surrounded by $$<latex here>$$. 
## Always give inline math in latex surrounded by $<latex here>$.
## Always give chemical equations in latex surrounded by $<latex here>$.
## Always give chemical equations in latex surrounded by $$<latex here>$$.
`;

export const RESPONSE_FORMAT_DIRECTIVE = endent`
RESPONSE FORMAT STARTS HERE
${LATEX_DIRECTIVE}
RESPONSE FORMAT ENDS HERE
`;

const HAS_EQUATIONS = endent`
## LATEX
The content provided to you has equations or math present in it. These equations should be written in LATEX:
   - Always give inline math in latex surrounded by $<latex here>$.
    - Always give block level math in latex surrounded by $$<latex here>$$. 
    - Always give inline chemical equations in latex surrounded by $<latex here>$.
    - Always give chemical equations in latex surrounded by $$<latex here>$$.
`;

export const getResponseFormatDirective = ({
  hasEquations,
}: {
  hasEquations: boolean | undefined;
}) => {
  let directivesBody: string[] = [];
  if (hasEquations) {
    directivesBody = [HAS_EQUATIONS];
  } else if (hasEquations === false) {
    directivesBody = [LATEX_DIRECTIVE];
  }
  return endent`
RESPONSE FORMAT INSTRUCTIONS STARTS HERE
${directivesBody.join("\n")}
RESPONSE FORMAT INSTRUCTIONS ENDS HERE
`;
};

export const EMOJI_DIRECTIVE = endent`
## Use emojis in your responses. Use emojis to express emotions. Use emojis to express your tone. DON'T use the same emoji again and again.
`;

export const ONE_PARAGRAPH_DIRECTIVE_SYSTEM = endent`
## DON'T give responses more than 1 paragraphs long. Always use simple sentences.
`;

export const ONE_PARAGRAPH_DIRECTIVE_USER = endent`DO NOT GIVE RESPONSES MORE THAN 1 PARAGRAPH LONG.`;
// Write a directive in hindi asking the AI to give responses in hindi

export const H_ONE_PARAGRAPH_DIRECTIVE_USER = endent`उत्तर एक अनुच्छेद से अधिक लंबे नहीं होने चाहिए।`;

export const HINDI_DIRECTIVE = endent`आपका संवाद का माध्यम हिंदी है। निम्नलिखित निर्देश(INSTRUCTIONS) अंग्रेजी में हैं, लेकिन आप छात्र से हमेशा हिंदी में बात करेंगे।`;
