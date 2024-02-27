import { MemoizedReactMarkdown } from "@/components/markdown-parser/markdown";
import { ElementContent } from "react-markdown/lib";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import { CodeBlock } from "@/app/(engines)/(merlin)/merlin/components/code-block";
import Image from "next/image";
import rehypeKatex from "rehype-katex";
import { useMemo } from "react";
import { preprocessLaTeX } from "../markdown-parser/preprocessor";

type TextElementContent = ElementContent & {
  value: string;
};

export function ChatMessageMarkdown({
  messageContent,
  isLastMessage,
  isLoading,
  messageRole,
}: {
  messageContent: string;
  isLastMessage?: boolean;
  isLoading?: boolean;
  messageRole?: string;
}) {
  const processedContent = useMemo(
    () => preprocessLaTeX(messageContent),
    [messageContent],
  );

  return (
    <MemoizedReactMarkdown
      className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        p({ children, node, ...props }) {
          const isLastParagraph =
            node?.position?.end.offset === processedContent.length;
          const showChubbi =
            messageRole !== "user" &&
            isLastMessage === true &&
            isLoading === true &&
            isLastParagraph;

          return (
            <p className={`mb-2 last:mb-0`} {...props}>
              {children}
              {showChubbi && (
                <Image
                  src="/chubbi.png"
                  alt="dot"
                  width={25}
                  height={25}
                  className="ml-1 inline-block"
                />
              )}
            </p>
          );
        },
        code({ node, className, children, ...props }) {
          if (Array.isArray(children) && children.length) {
            if (children[0] === "▍") {
              return (
                <span className="mt-1 animate-pulse cursor-default">▍</span>
              );
            }
            children[0] = (children[0] as string).replace("`▍`", "▍");
          }
          const match = className ? /language-(\w+)/.exec(className) : null;

          // Check if the parent node is 'pre' to determine if it's a block code
          if (node && node.tagName === "code" && match) {
            let codeValue = "";
            if (
              Array.isArray(node.children) &&
              node.children[0] &&
              (node.children[0] as TextElementContent).value
            ) {
              codeValue = (
                node.children[0] as TextElementContent
              ).value.replace(/\n$/, "");
            }

            return (
              <CodeBlock
                key={Math.random()}
                language={match[1]}
                value={
                  codeValue ? codeValue : String(children).replace(/\n$/, "")
                }
                {...props}
              />
            );
          } else {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }
        },
      }}
    >
      {processedContent}
    </MemoizedReactMarkdown>
  );
}
