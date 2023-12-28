export const LATEX_DIRECTIVE = `
## Always give math in latex surrounded by $$<latex here>$$. 
## Always give inline math in latex surrounded by $<latex here>$.
`;

export const RESPONSE_FORMAT_DIRECTIVE = `
RESPONSE FORMAT STARTS HERE
${LATEX_DIRECTIVE}
RESPONSE FORMAT ENDS HERE
`;

export const EMOJI_DIRECTIVE = `
## Use emojis in your responses. Use emojis to express emotions. Use emojis to express your tone. But don't overuse emojis, or use the same emoji again and again.
`;

export const ONE_PARAGRAPH_DIRECTIVE_SYSTEM = `
## DON'T give responses more than 1 paragraphs long. Always use simple sentences.
`;

export const ONE_PARAGRAPH_DIRECTIVE_USER = `DO NOT GIVE RESPONSES MORE THAN 1 PARAGRAPH LONG.`;
