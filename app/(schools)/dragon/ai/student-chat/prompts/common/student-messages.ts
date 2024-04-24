import endent from "endent";
import { ChatCompletionUserMessageParam } from "openai/resources";
import { H_ONE_PARAGRAPH_DIRECTIVE_USER } from "./directives";

const HINDI_DIRECTIVE = endent`मैं आपसे एक विनम्र निवेदन करना चाहता हूँ। मुझसे सिर्फ हिंदी में बात करें। मुझे इसमें अधिक सहजता महसूस होती है। यह मेरी समझ और सीखने में बहुत मदद करेगा। ${H_ONE_PARAGRAPH_DIRECTIVE_USER}`;
export const replyInHindi: ChatCompletionUserMessageParam = {
  role: "user",
  content: HINDI_DIRECTIVE,
};
