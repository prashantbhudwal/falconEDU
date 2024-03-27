"use client";
import { UseChatHelpers } from "ai/react";
import * as React from "react";
import Textarea from "react-textarea-autosize";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useMediaQuery } from "usehooks-ts";
import { isProcessingAudioAtom, isRecordingAtom } from "@/lib/atoms/recorder";
import { useAtomValue } from "jotai";
import { Button } from "@ui/button";
import { useEnterSubmit } from "../../hooks/use-enter-submit";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { useEffect } from "react";
import { TaskType } from "@/types";
import { RecordingButton } from "./record-button";

export interface PromptProps
  extends Pick<UseChatHelpers, "input" | "setInput"> {
  onSubmit: (value: string) => Promise<void>;
  isLoading: boolean;
  type: TaskType;
  attemptId: string;
  taskId: string;
}

export function PromptForm({
  onSubmit,
  input,
  setInput,
  isLoading,
  type,
  attemptId,
  taskId,
}: PromptProps) {
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isProcessingAudio = useAtomValue(isProcessingAudioAtom);
  const isRecording = useAtomValue(isRecordingAtom);

  // Auto focus input when loading is done
  useEffect(() => {
    if (inputRef.current && !isLoading && isDesktop) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input?.trim()) {
      return;
    }
    setInput("");
    await onSubmit(input);
  };

  const placeholder = isRecording
    ? "listening..."
    : isProcessingAudio
      ? "processing..."
      : "Type a message...";

  return (
    <form onSubmit={handleSubmit} ref={formRef}>
      <div className="relative flex w-full items-center space-x-2 bg-base-300 px-2 shadow-md shadow-base-300">
        <RecordingButton
          type={type}
          attemptId={attemptId}
          taskId={taskId}
          setInput={setInput}
        />
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          rows={1}
          value={input}
          disabled={isLoading || isProcessingAudio}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          spellCheck={false}
          className={cn(
            "min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none disabled:cursor-not-allowed sm:text-sm",
            {
              " placeholder:animate-pulse placeholder-shown:animate-pulse placeholder-shown:font-bold":
                isProcessingAudio,
            },
          )}
        />
        <Button
          variant="ghost"
          type="submit"
          size="icon"
          disabled={isLoading || input === ""}
          className="mr-2 hover:bg-base-300"
        >
          <PaperAirplaneIcon className="text-secondary" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </form>
  );
}
