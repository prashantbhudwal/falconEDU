import { type Message } from "ai";

import { ChatMessage } from "./chat-message";

export interface ChatList {
  messages: Message[];
  botImage?: string;
  studentImage?: string;
}

export function ChatList({ messages, botImage, studentImage }: ChatList) {
  if (!messages.length) {
    return null;
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4 flex flex-col space-y-4 ">
      {messages.map((message, index) => (
        <div key={index}>
          <ChatMessage
            message={message}
            botImage={botImage}
            studentImage={studentImage}
          />
        </div>
      ))}
    </div>
  );
}
