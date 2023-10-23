"use client";
import { useChat, type Message } from "ai/react";
import { cn } from "../../lib/utils";
import { ChatList } from "./chat-list";
import { ChatPanel } from "./chat-panel";
import { toast } from "react-hot-toast";
import { useRef, useLayoutEffect } from "react";

export interface ChatProps extends React.ComponentProps<"div"> {
  initialMessages?: Message[];
  id?: string;
  apiPath: string;
  emptyMessage: string;
  chatBody: Record<string, unknown>;
  botImage?: string;
  isDisabled?: boolean;
  isSubmitted?: boolean;
}

export function Chat({
  id,
  initialMessages,
  apiPath,
  emptyMessage,
  className,
  chatBody,
  botImage,
  isDisabled = false,
  isSubmitted = false,
}: ChatProps) {
  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      api: apiPath,
      initialMessages,
      id,
      body: chatBody,
      onResponse(response) {
        if (response.status === 401) {
          toast.error(response.statusText);
        }
      },
    });
  const containerRef = useRef<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    const scrollToEnd = () => {
      const container = containerRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight; //  might need to adjust this if there's a fixed header/footer.
      }
    };

    if (messages.length) {
      scrollToEnd();
    }
  }, [messages]);

  return (
    <div
      className="overflow-y-scroll custom-scrollbar h-screen"
      ref={containerRef}
    >
      <div className={cn("pb-[200px] pt-4 md:pt-10", className)}>
        {messages.length ? (
          <>
            <ChatList messages={messages} botImage={botImage} />
          </>
        ) : (
          <div className="mx-auto max-w-2xl px-4 pt-8">
            <div className="bg-slate-900 py-4 rounded-md flex place-content-center">
              <h1 className="text-xl font-medium text-slate-500">
                {emptyMessage}
              </h1>
            </div>
          </div>
        )}
      </div>
      {!isDisabled && !isSubmitted ? (
        <ChatPanel
          id={id}
          isLoading={isLoading}
          stop={stop}
          append={append}
          reload={reload}
          messages={messages}
          input={input}
          setInput={setInput}
        />
      ) : (
        <div className="fixed inset-x-0 bottom-0 bg-gray-900 text-white p-4 rounded-t-lg shadow-lg">
          <h1 className="text-center text-lg font-semibold">
            {!isSubmitted ? "No longer active." : "Already submitted."}
          </h1>
        </div>
      )}
    </div>
  );
}
