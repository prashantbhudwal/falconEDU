import { Message } from "ai";
import UserAvatar from "@/components/avatar";
import { Avatar, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";
import { ChatMessageActions } from "./chat-message-actions";
import { ChatMessageMarkdown } from "./chat-message-markdown";

export interface ChatMessageProps {
  message: Message;
  botImage?: string;
  studentImage?: string;
  isLastMessage?: boolean;
  isLoading?: boolean;
  hideActions?: boolean;
}

export function ChatMessage({
  message,
  botImage,
  studentImage,
  isLastMessage,
  isLoading,
  hideActions,
  ...props
}: ChatMessageProps) {
  const role = message.role;
  const isUser = role === "user";
  return (
    <div
      className={cn(
        "group relative flex items-start rounded-xl px-2 py-3 md:-ml-12",
        {
          "bg-zinc-700": isUser,
          "bg-base-100": !isUser,
        },
      )}
      {...props}
    >
      <div
        className={cn(
          "flex shrink-0 select-none items-center justify-center rounded-md",
        )}
      >
        {message.role === "user" ? (
          studentImage ? (
            <Avatar className="h-6 w-6">
              <AvatarImage src={studentImage} className="" />
            </Avatar>
          ) : (
            <UserAvatar />
          )
        ) : (
          <Avatar className="h-6 w-6">
            <AvatarImage src={botImage ? botImage : "/chubbi.png"} />
          </Avatar>
        )}
      </div>
      <div className="ml-2 flex-1 space-y-2 overflow-hidden px-1">
        <ChatMessageMarkdown
          key={`message-${isLoading}`}
          messageContent={message.content}
          isLastMessage={isLastMessage}
          isLoading={isLoading}
          messageRole={message.role}
        />
        {!hideActions && (
          <ChatMessageActions isLastMessage={isLastMessage} message={message} />
        )}
      </div>
    </div>
  );
}
