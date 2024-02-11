"use client";
import { type UseChatHelpers } from "ai/react";

import { PromptForm } from "./prompt-form";
import { useAtom } from "jotai";
import { showVideoModalAtom } from "@/lib/atoms/ui";
import { ChatSuggestions } from "./suggestions";
import { TaskType } from "@/types";

export interface ChatPanelProps
  extends Pick<
    UseChatHelpers,
    | "append"
    | "isLoading"
    | "reload"
    | "messages"
    | "stop"
    | "input"
    | "setInput"
  > {
  id: string;
  showSuggestions?: boolean;
  type: TaskType;
  taskId: string;
}

export function ChatPanel({
  id,
  isLoading,
  stop,
  append,
  reload,
  input,
  setInput,
  messages,
  showSuggestions = true,
  type,
  taskId,
}: ChatPanelProps) {
  const [showVideoModal, setShowVideoModal] = useAtom(showVideoModalAtom);

  return (
    <div className=" fixed inset-x-0 bottom-0">
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        {showSuggestions && !isLoading && <ChatSuggestions append={append} />}
        <PromptForm
          onSubmit={async (value) => {
            setShowVideoModal(false);
            await append({
              id,
              content: value,
              role: "user",
            });
          }}
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          type={type}
          attemptId={id}
          taskId={taskId}
        />
      </div>
    </div>
  );
}

{
  /* {isLoading ? (
            <Button
              variant="outline"
              onClick={() => stop()}
              className="bg-background"
            >
              <IconStop className="mr-2" />
              Stop
            </Button>
          ) : (
            messages?.length > 0 && (
              <Button
                variant="outline"
                onClick={() => reload()}
                className="bg-base-300"
              >
                <IconRefresh className="mr-2" />
                Regenerate
              </Button>
            )
          )} */
}
