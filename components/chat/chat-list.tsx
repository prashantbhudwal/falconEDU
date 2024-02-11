import { type Message } from "ai";

import { ChatMessage } from "./chat-message";
import { TaskType } from "@/types";

export interface ChatList {
  messages: Message[];
  botImage?: string;
  studentImage?: string;
  isLoading?: boolean;
  hideActions?: boolean;
  attemptId: string;
  taskId: string;
  type: TaskType;
}

export function ChatList({
  messages,
  botImage,
  studentImage,
  isLoading,
  hideActions,
  attemptId,
  taskId,
  type,
}: ChatList) {
  if (!messages.length) {
    return null;
  }

  return (
    <div className="relative mx-auto flex max-w-2xl flex-col space-y-3 px-2 pb-10">
      {messages.map((message, index) => {
        const isLastMessage = index === messages.length - 1;
        return (
          <div key={index}>
            <ChatMessage
              message={message}
              botImage={botImage}
              studentImage={studentImage}
              isLastMessage={isLastMessage}
              isLoading={isLoading}
              hideActions={hideActions}
              attemptId={attemptId}
              taskId={taskId}
              type={type}
            />
          </div>
        );
      })}
    </div>
  );
}
