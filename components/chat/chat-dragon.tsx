"use client";
import { useChat, type Message } from "ai/react";
import { cn } from "../../lib/utils";
import { ChatList } from "./chat-list";
import { ChatPanel } from "./chat-panel";
import { toast } from "react-hot-toast";
import { useRef, useLayoutEffect, useState, useEffect } from "react";
import { MdOutlineKeyboardDoubleArrowDown } from "react-icons/md";
import { Button } from "../ui/button";
import { useInView } from "react-intersection-observer";

export interface ChatProps extends React.ComponentProps<"div"> {
  initialMessages?: Message[];
  id?: string;
  apiPath: string;
  emptyMessage: string;
  chatBody: Record<string, unknown>;
  botImage?: string;
  isDisabled?: boolean;
  isSubmitted?: boolean;
  type: string;
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
  type,
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
  const { ref: referenceContainerRef, inView, entry } = useInView();
  const [autoScrolling, setAutoScrolling] = useState(false);

  const scrollToEnd = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight; //  might need to adjust this if there's a fixed header/footer.
    }
  };

  useLayoutEffect(() => {
    if (messages.length && autoScrolling) {
      scrollToEnd();
    }
    if (inView && !isLoading) {
      setAutoScrolling(false);
    }
  }, [messages, autoScrolling, inView, isLoading]);

  return (
    <div className="relative">
      <div
        className="overflow-y-scroll custom-scrollbar h-screen"
        ref={containerRef}
      >
        <div className={cn("pb-[200px] pt-4 md:pt-10", className)}>
          {messages.length ? (
            <>
              <ChatList
                messages={messages}
                botImage={botImage}
                isLoading={isLoading}
                hideActions={type === "test"}
              />
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
          <div ref={referenceContainerRef}></div>
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
      {!inView && (
        <Button
          variant="secondary"
          onClick={() => setAutoScrolling(true)}
          className="absolute bottom-[200px] right-[46%] -translate-x-1/2 hover:bg-secondary rounded-full"
        >
          <MdOutlineKeyboardDoubleArrowDown className="text-2xl" />
        </Button>
      )}
    </div>
  );
}
