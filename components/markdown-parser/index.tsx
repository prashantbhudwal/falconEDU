import { MemoizedReactMarkdown } from "@/components/markdown-parser/markdown";
import { ElementContent } from "react-markdown/lib";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import { CodeBlock } from "@/app/(engines)/(merlin)/merlin/components/code-block";
import rehypeKatex from "rehype-katex";
import { cn } from "@/lib/utils";

type TextElementContent = ElementContent & {
  value: string;
};

export function AIMarkdown({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <MemoizedReactMarkdown
      className={cn(
        "prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0",
        className,
      )}
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        p({ children, node, ...props }) {
          return (
            <p className={`mb-2 last:mb-0`} {...props}>
              {children}
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
      {content}
    </MemoizedReactMarkdown>
  );
}
