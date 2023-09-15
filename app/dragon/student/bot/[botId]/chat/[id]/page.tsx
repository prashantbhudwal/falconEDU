"use client";
import {bots} from "@/app/dragon/test-data";
import { ChatPanel } from "@/components/chat/chat-panel";
import { ChatList } from "@/components/chat/chat-list";
import { ChatScrollAnchor } from "@/components/chat/chat-scroll-anchor";
import { cn } from "@/lib/utils";
import { Message, useChat } from "ai/react";
import { toast } from "react-hot-toast";
export interface ChatPageProps {
  params: {
    id: string;
  };
}

export default function ChatPage({ params }: ChatPageProps) {
  const id = params.id;
  const initialMessages: Message[] = [];

  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      api: "/dragon/api/chat",
      initialMessages,
      id,
      body: {
        id,
      },
      onResponse(response) {
        if (response.status === 401) {
          toast.error(response.statusText);
        }
      },
    });
  const className = "";
  return (
    <div className="overflow-y-scroll custom-scrollbar">
      <div className={cn("pb-[200px] pt-4 md:pt-10", className)}>
        {messages.length ? (
          <>
            <ChatList messages={messages} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
          <div className="mx-auto max-w-2xl px-4">
            <div className="rounded-sm p-8">
              <h1 className="mb-2 text-lg">
                Hello I am Chubbi! Your personal teaching assistant.
              </h1>
            </div>
          </div>
        )}
      </div>
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
    </div>
  );
}
