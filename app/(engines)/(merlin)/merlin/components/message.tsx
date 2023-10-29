import { cn } from "@/lib/utils";
import { ChatMessageMarkdown } from "@/components/chat/chat-message-markdown";

export interface ChatMessageProps {
  message: string;
}

export function Message({ message, ...props }: ChatMessageProps) {
  return (
    <div
      className={cn("group relative mb-1 flex w-full items-start pt-2 text-sm")}
      {...props}
    >
      <div className="ml-2 flex-1 space-y-1 overflow-hidden px-1">
        <ChatMessageMarkdown messageContent={message} />
      </div>
    </div>
  );
}
