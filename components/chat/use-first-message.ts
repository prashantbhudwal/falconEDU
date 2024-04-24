import { useEffect } from "react";
import { CreateMessage } from "ai";
import { TaskType } from "@/types";
import { getFirstMessage } from "@/app/(schools)/dragon/ai/student-chat/prompts/common/start-messages";

export function useFirstMessage({
  messages,
  append,
  type,
}: {
  messages: CreateMessage[];
  append: (message: CreateMessage) => Promise<string | null | undefined>;
  type: string;
}) {
  useEffect(() => {
    const customWindow = window as any;
    if (!messages || messages.length === 0) {
      if (process.env.NODE_ENV === "development" && customWindow.hasRunEffect) {
        return;
      }
      customWindow.hasRunEffect = true;
      const firstMessage = getFirstMessage({
        language: "english",
        taskType: type as TaskType,
      });
      append(firstMessage);
    }
  }, []);
}
