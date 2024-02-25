import React, { useState, ChangeEvent } from "react";

import { cn } from "@/lib/utils";
import { Textarea, TextareaProps } from "./textarea";

type TextareaWithCounterProps = TextareaProps & {
  hasCounter?: boolean;
  maxChars?: number;
};

export const TextareaWithCounter: React.FC<TextareaWithCounterProps> = ({
  hasCounter,
  maxChars,
  onChange,
  className,
  ...props
}) => {
  const [count, setCount] = useState(0);

  const handleCount = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    // Removed the early return, so users can continue typing
    setCount(value.length);

    if (onChange) {
      onChange(e);
    }
  };

  const withinWarningLimit = maxChars ? count >= maxChars * 0.5 : false;

  return (
    <div className="relative h-full">
      <Textarea
        {...props}
        onChange={handleCount}
        className={cn(
          "scrollbar-sm min-h-[200px] sm:min-h-[150px]",
          className,
          {
            "border border-error focus-visible:ring-error":
              count >= (maxChars ?? Number.POSITIVE_INFINITY),
            "pt-8": hasCounter && withinWarningLimit,
            "focus-visible:ring-warning": withinWarningLimit,
          },
        )}
      />
      {hasCounter && withinWarningLimit && (
        <span
          className={cn("badge badge-lg absolute right-3 top-2 text-xs", {
            "text-warning": withinWarningLimit,
            "text-error": count >= (maxChars ?? Number.POSITIVE_INFINITY),
          })}
        >
          {maxChars ? maxChars - count : ``}
        </span>
      )}
    </div>
  );
};
