import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { cn } from "../utils";
import { CodeBlock } from "./CodeBlock";
import { MemoizedReactMarkdown } from "@/components/Markdown";

export interface ChatMessageProps {
  message: string;
}

export function Message({ message, ...props }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "group relative mb-1 flex w-full items-start pt-2 text-sm"
      )}
      {...props}
    >
      <div className="ml-2 flex-1 space-y-1 overflow-hidden px-1">
        <MemoizedReactMarkdown
          className="prose prose-sm w-full break-words prose-p:leading-normal prose-pre:p-0"
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-1 last:mb-0">{children}</p>;
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
          {message}
        </MemoizedReactMarkdown>
      </div>
    </div>
  );
}
