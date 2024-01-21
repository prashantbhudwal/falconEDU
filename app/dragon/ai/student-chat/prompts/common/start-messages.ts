import { TaskType } from "@/types";
import { ChatCompletionUserMessageParam } from "openai/resources";
import { CreateMessage } from "ai";

export const getFirstMessage = ({
  taskType,
  language = "english",
}: {
  taskType: TaskType;
  language: "hindi" | "english";
}) => {
  const firstMessageContent = {
    test: {
      english: "Can you start the test? I am ready.",
      hindi: "क्या आप टेस्ट शुरू कर सकते हैं? मैं तैयार हूँ।",
    },
    lesson: {
      english: "Can you start the lesson? I am ready.",
      hindi: "क्या आप पाठ शुरू कर सकते हैं? मैं तैयार हूँ।",
    },
    chat: {
      english: "What can you do?",
      hindi: "आप क्या कर सकते हैं?",
    },
    "ai-test": {
      english: "Can you start the test? I am ready.",
      hindi: "क्या आप टेस्ट शुरू कर सकते हैं? मैं तैयार हूँ।",
    },
  };

  const messageContent = firstMessageContent[taskType][language];

  const message: CreateMessage = {
    role: "user",
    content: messageContent,
  };
  return message;
};
