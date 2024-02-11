"use client";
import { useChat, type Message } from "ai/react";
import { cn } from "../../lib/utils";
import { ChatList } from "./chat-list";
import { ChatPanel } from "./chat-panel";
import { toast } from "react-hot-toast";
import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import { MdOutlineKeyboardDoubleArrowDown } from "react-icons/md";
import { Button } from "../ui/button";
import { useInView } from "react-intersection-observer";
import { chatIsLoadingAtom } from "@/lib/atoms/student";
import { useUI } from "@/hooks/ai/use-ui";
import { useAtomValue, useSetAtom } from "jotai";
import { useFirstMessage } from "./use-first-message";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { showVideoModalAtom, videoUrlAtom } from "@/lib/atoms/ui";
import ReactPlayer from "react-player";
import { motion } from "framer-motion";
import { TaskType } from "@/types";

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
}

const scrollToPercentage = (
  percent: number,
  containerRef: React.RefObject<HTMLElement>,
) => {
  const container = containerRef.current;
  if (container) {
    const scrollPosition = container.scrollHeight * (percent / 100);
    container.scrollTo({
      top: scrollPosition,
      behavior: "smooth",
    });
  }
};

const scrollToEnd = (containerRef: React.RefObject<HTMLElement>) => {
  const container = containerRef.current;
  if (container) {
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    }); //  might need to adjust this if there's a fixed header/footer.
  }
};

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
  useUI({ data, isLoading });
  useEffect(() => {
    setIsLoadingAtom(isLoading);
  }, [isLoading, setIsLoadingAtom]);

  useEffect(() => {
    if (messages.length) {
      scrollToPercentage(100, containerRef);
    }
  }, [messages.length]);

  useFirstMessage({ messages, append, type });

  useLayoutEffect(() => {
    if (messages.length && autoScrolling) {
      scrollToEnd(containerRef);
    }
    if (inView && !isLoading) {
      setAutoScrolling(false);
    }
  }, [messages, autoScrolling, inView, isLoading]);

  function renderChatPanel() {
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
      <div className="fixed inset-x-0 bottom-0 rounded-t-lg bg-gray-900 p-4 text-white shadow-lg">
        <h1 className="text-center text-lg font-semibold">
          {!isSubmitted ? "No longer active." : "Already submitted."}
        </h1>
      </div>
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

const EmptyMessage = ({ message }: { message: string }) => {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-8">
      <div className="flex place-content-center rounded-md bg-slate-900 py-4">
        <h1 className="text-xl font-medium text-slate-500">{message}</h1>
      </div>
    </div>
  );
};

const VideoCard = ({ videoUrl }: { videoUrl: string }) => {
  const shadowAnimation = {
    initial: {
      boxShadow: "0px 0px 0px rgba(0, 0, 0, 0)", // No shadow
    },
    animate: {
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.5)", // Visible shadow
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={shadowAnimation}
      transition={{ duration: 0.5 }}
    >
      <Card className="mx-auto w-fit shadow-lg shadow-secondary">
        <CardHeader>
          <CardTitle>Recommended Video</CardTitle>
        </CardHeader>
        <CardContent className="bg-base-200">
          {ReactPlayer.canPlay(videoUrl) ? (
            <ReactPlayer
              url={videoUrl}
              controls={true}
              height={200}
              width={"100%"}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center">
              <p className="text-center text-gray-500">
                This video is not supported.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const InDev = ({ component }: { component: React.ReactNode }) => {
  if (process.env.NODE_ENV === "production") {
    return null;
  }
  return (
    <div className="fixed bottom-1/2 right-2 z-20 min-h-36 w-fit border border-dotted border-accent/60 p-2">
      {component}
    </div>
  );
};
