# ReadMe for package.json

## docx

- Don't upgrade docx package as it is not compatible with the current code.

## openai

- Openai is not compatible with edge, use openai-edge for edge functions.

## radix-ui

- radix is used by shad-cn, don't use radix directly without shad-cn.

## sharp: DON'T UPDATE SHARP

Latest sharp version is not compatible with vercel serverless. Use v0.32.6 for vercel serverless.
See: https://github.com/lovell/sharp/issues/3870
