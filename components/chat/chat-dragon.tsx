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
import { chatIsLoadingAtom } from "@/lib/atoms/student";
import { useSubmitTest } from "@/hooks/ai/use-submit-test";
import { useAtom } from "jotai";
import { useFirstMessage } from "./use-first-message";

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
  const { messages, append, reload, stop, isLoading, input, setInput, data } =
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

  useSubmitTest({ data, isLoading });

  const [, setIsLoadingAtom] = useAtom(chatIsLoadingAtom);
  useEffect(() => {
    setIsLoadingAtom(isLoading);
  }, [isLoading, setIsLoadingAtom]);

  const scrollToPercentage = (percent: any) => {
    const container = containerRef.current;
    if (container) {
      const scrollPosition = container.scrollHeight * (percent / 100);
      container.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (messages.length) {
      scrollToPercentage(100);
    }
  }, [messages.length]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { ref: referenceContainerRef, inView, entry } = useInView();
  const [autoScrolling, setAutoScrolling] = useState(false);

  const scrollToEnd = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      }); //  might need to adjust this if there's a fixed header/footer.
    }
  };

  useFirstMessage({ messages, append, type });

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
        className="custom-scrollbar h-screen overflow-y-scroll"
        ref={containerRef}
      >
        <div className={cn("pb-[250px] pt-4 md:pt-10", className)}>
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
              <div className="flex place-content-center rounded-md bg-slate-900 py-4">
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
          <div className="fixed inset-x-0 bottom-0 rounded-t-lg bg-gray-900 p-4 text-white shadow-lg">
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
          className="fixed bottom-[80px] left-1/2 w-fit -translate-x-1/2 rounded-full hover:bg-secondary"
        >
          <MdOutlineKeyboardDoubleArrowDown className="animate-pulse text-2xl" />
        </Button>
      )}
    </div>
  );
}
