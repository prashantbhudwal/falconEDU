import { type Message } from "ai";

import { Separator } from "@ui/separator";
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
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message, index) => (
        <div key={index}>
          <ChatMessage
            message={message}
            botImage={botImage}
            studentImage={studentImage}
          />
          {index < messages.length - 1 && (
            <Separator className="my-4 md:my-8" />
          )}
        </div>
      ))}
    </div>
  );
}
