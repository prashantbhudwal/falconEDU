import { UseChatHelpers } from "ai/react";
import * as React from "react";
import Textarea from "react-textarea-autosize";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

import { Button } from "@ui/button";
import { useEnterSubmit } from "../../hooks/use-enter-submit";

export interface PromptProps
  extends Pick<UseChatHelpers, "input" | "setInput"> {
  onSubmit: (value: string) => Promise<void>;
  isLoading: boolean;
}

export function PromptForm({
  onSubmit,
  input,
  setInput,
  isLoading,
}: PromptProps) {
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (inputRef.current && !isLoading) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!input?.trim()) {
          return;
        }
        setInput("");
        await onSubmit(input);
      }}
      ref={formRef}
    >
      <div className="bg-base-300 shadow-md shadow-base-300 relative flex max-h-60 w-full grow flex-col overflow-hidden px-8 sm:rounded-md sm:border sm:px-12">
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          rows={1}
          value={input}
          disabled={isLoading}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Send a message"
          spellCheck={false}
          className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm disabled:cursor-not-allowed"
        />
        <div className="absolute right-0 bottom-2 sm:right-4">
          <Button
            variant="ghost"
            type="submit"
            size="icon"
            disabled={isLoading || input === ""}
            className="mr-2"
          >
            <PaperAirplaneIcon className="text-secondary" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
