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
import { useAtom } from "jotai";
import { useFirstMessage } from "./use-first-message";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { showVideoModalAtom, videoUrlAtom } from "@/lib/atoms/ui";
import ReactPlayer from "react-player";
import { AspectRatio } from "../ui/aspect-ratio";
import { motion } from "framer-motion";

const InDev = ({ component }: { component: React.ReactNode }) => {
  if (process.env.NODE_ENV === "production") {
    return null;
  }
  return (
    <div className="fixed bottom-3 right-2 min-h-36 w-fit border border-dotted border-accent/60 p-2">
      {component}
    </div>
  );
};

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
  const borderAnimation = {
    initial: {
      borderColor: "rgba(255, 255, 255, 0)", // Transparent border
    },
    animate: {
      borderColor: "rgba(255, 255, 255, 1)", // Solid white border
    },
  };

  const shadowAnimation = {
    initial: {
      boxShadow: "0px 0px 0px rgba(0, 0, 0, 0)", // No shadow
    },
    animate: {
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.5)", // Visible shadow
    },
  };
  const [showVideoModal, setShowVideoModal] = useAtom(showVideoModalAtom);
  const [videoUrl, setVideoUrl] = useAtom(videoUrlAtom);
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
        <InDev component={<Button onClick={() => reload()}>Reload</Button>} />
        <div className={cn("pb-[250px] pt-4 md:pt-10", className)}>
          {messages.length ? (
            <>
              <ChatList
                messages={messages}
                botImage={botImage}
                isLoading={isLoading}
                hideActions={type === "test"}
              />
              {showVideoModal && (
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
              )}
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
