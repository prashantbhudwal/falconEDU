import { Message } from "ai";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import UserAvatar from "@/components/avatar";
import { Avatar, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";
import { CodeBlock } from "@/app/(falcon)/(merlin)/merlin/components/code-block";
import { MemoizedReactMarkdown } from "@/components/markdown";
import { ChatMessageActions } from "./chat-message-actions";
import Image from "next/image";

export interface ChatMessageProps {
  message: Message;
  botImage?: string;
}

export function ChatMessage({ message, botImage, ...props }: ChatMessageProps) {
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
          <UserAvatar />
        ) : (
          <Avatar>
            <AvatarImage src={botImage ? botImage : "/chubbi.png"} />
          </Avatar>
        )}
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
        <MemoizedReactMarkdown
          className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>;
            },
            code({ node, inline, className, children, ...props }) {
              if (children.length) {
                if (children[0] == "▍") {
                  return (
                    <span className="mt-1 animate-pulse cursor-default">▍</span>
                  );
                }

                children[0] = (children[0] as string).replace("`▍`", "▍");
              }

              const match = /language-(\w+)/.exec(className || "");

              if (inline) {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }

              return (
                <CodeBlock
                  key={Math.random()}
                  language={(match && match[1]) || ""}
                  value={String(children).replace(/\n$/, "")}
                  {...props}
                />
              );
            },
          }}
        >
          {message.content}
        </MemoizedReactMarkdown>
        <ChatMessageActions message={message} />
      </div>
    </div>
  );
}
