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
import { useUI } from "@/hooks/ai/use-ui";
import { useAtomValue, useSetAtom } from "jotai";
import { useFirstMessage } from "./use-first-message";
import { showVideoModalAtom, videoUrlAtom } from "@/lib/atoms/ui";
import { TaskType } from "@/types";
import { VideoCard } from "./video-card";
import { InDev } from "./in-dev";
import { scrollToEnd, scrollToPercentage } from "./helpers";
import { EmptyMessage } from "./empty-message";
import { MaxLimitReached } from "./max-limit-reached";
import { PanelInactive } from "./panel-inactive";

export interface ChatProps extends React.ComponentProps<"div"> {
  initialMessages?: Message[];
  id: string;
  apiPath: string;
  emptyMessage: string;
  chatBody: Record<string, unknown>;
  botImage?: string;
  isDisabled?: boolean;
  isSubmitted?: boolean;
  type: TaskType;
  hidePanel?: boolean;
  taskId: string;
  maxMessages?: number;
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
  hidePanel,
  taskId,
  maxMessages,
}: Readonly<ChatProps>) {
  const [autoScrolling, setAutoScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const showVideoModal = useAtomValue(showVideoModalAtom);
  const setIsLoadingAtom = useSetAtom(chatIsLoadingAtom);
  const videoUrl = useAtomValue(videoUrlAtom);
  const { ref: referenceContainerRef, inView } = useInView();
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
  // controls the UI of the chat using data generated from the LLM
  useUI({ data, isLoading });

  // custom hook auto send first message
  useFirstMessage({ messages, append, type });

  useEffect(() => {
    setIsLoadingAtom(isLoading);
  }, [isLoading, setIsLoadingAtom]);

  useEffect(() => {
    if (messages.length) {
      scrollToPercentage(100, containerRef);
    }
  }, [messages.length]);

  useLayoutEffect(() => {
    if (messages.length && autoScrolling) {
      scrollToEnd(containerRef);
    }
    if (inView && !isLoading) {
      setAutoScrolling(false);
    }
  }, [messages, autoScrolling, inView, isLoading]);

  function renderChatPanel() {
    if (maxMessages && messages.length >= maxMessages)
      return <MaxLimitReached />;
    if (hidePanel) return null;
    if (!isDisabled && !isSubmitted) {
      return (
        <ChatPanel
          id={id}
          isLoading={isLoading}
          stop={stop}
          append={append}
          reload={reload}
          messages={messages}
          input={input}
          setInput={setInput}
          showSuggestions={type === "lesson"}
          type={type}
          taskId={taskId}
        />
      );
    }
    return (
      <PanelInactive
        message={!isSubmitted ? "No longer active." : "Already submitted."}
      />
    );
  }

  return (
    <div className="relative">
      <div
        className="custom-scrollbar h-screen overflow-y-scroll"
        ref={containerRef}
      >
        <InDev component={<Button onClick={() => reload()}>Reload</Button>} />
        <div className={cn("pb-[250px] pt-4 md:pt-10", className)}>
          {messages.length ? (
            <>
              <ChatList
                messages={messages}
                botImage={botImage}
                isLoading={isLoading}
                hideActions={type === "test"}
                attemptId={id}
                taskId={taskId}
                type={type}
              />
              {showVideoModal && <VideoCard videoUrl={videoUrl} />}
            </>
          ) : (
            <EmptyMessage message={emptyMessage} />
          )}
          <div ref={referenceContainerRef}></div>
        </div>
        {renderChatPanel()}
      </div>
      {!inView && (
        <Button
          variant="secondary"
          onClick={() => setAutoScrolling(true)}
          className="fixed bottom-[120px] right-0 h-8 w-8 -translate-x-1/2 rounded-xl p-0 hover:bg-secondary"
        >
          <MdOutlineKeyboardDoubleArrowDown className="animate-pulse text-lg" />
        </Button>
      )}
    </div>
  );
}
