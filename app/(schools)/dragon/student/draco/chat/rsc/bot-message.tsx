"use client";

import { StreamableValue } from "ai/rsc/dist";
import { useStreamableText } from "../use-streamable-text";
import { cn } from "@/lib/utils";
import { AIMarkdown } from "@/components/chat/ai-markdown";
import { PieChartIcon } from "@radix-ui/react-icons";

export function BotMessage({
  content,
  className,
}: {
  content: string | StreamableValue<string>;
  className?: string;
}) {
  const text = useStreamableText(content);

  return (
    <div className={cn("group relative flex items-start md:-ml-12", className)}>
      <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm">
        <PieChartIcon />
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
        <AIMarkdown content={text} />
      </div>
    </div>
  );
}
