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
  return (
    <div
      className={cn("group relative mb-4 flex items-start md:-ml-12")}
      {...props}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md",
          message.role === "user" ? "bg-base-100" : "bg-base-300"
        )}
      >
        {message.role === "user" ? (
          studentImage ? (
            <Avatar>
              <AvatarImage src={studentImage} />
            </Avatar>
          ) : (
            <UserAvatar />
          )
        ) : (
          <Avatar>
            <AvatarImage src={botImage ? botImage : "/chubbi.png"} />
          </Avatar>
        )}
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
        <ChatMessageMarkdown
          key={`message-${isLoading}`}
          messageContent={message.content}
          isLastMessage={isLastMessage}
          isLoading={isLoading}
          messageRole={message.role}
        />
        {!hideActions && <ChatMessageActions message={message} />}
      </div>
    </div>
  );
}
