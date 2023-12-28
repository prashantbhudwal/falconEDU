import { type Message } from "ai";

import { ChatMessage } from "./chat-message";

export interface ChatList {
  messages: Message[];
  botImage?: string;
  studentImage?: string;
  isLoading?: boolean;
  hideActions?: boolean;
}

export function ChatList({
  messages,
  botImage,
  studentImage,
  isLoading,
  hideActions,
}: ChatList) {
  if (!messages.length) {
    return null;
  }

  return (
    <div className="relative mx-auto max-w-2xl px-2 flex flex-col space-y-3 pb-10">
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
            />
          </div>
        );
      })}
    </div>
  );
}
