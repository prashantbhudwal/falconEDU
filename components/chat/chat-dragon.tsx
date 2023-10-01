"use client";
import { useChat, type Message } from "ai/react";
import { cn } from "../../lib/utils";
import { ChatList } from "./chat-list";
import { ChatPanel } from "./chat-panel";
import { ChatScrollAnchor } from "./chat-scroll-anchor";
import { toast } from "react-hot-toast";

export interface ChatProps extends React.ComponentProps<"div"> {
  initialMessages?: Message[];
  id?: string;
  apiPath: string;
  emptyMessage: string;
  chatBody: Record<string, unknown>;
  botImage?: string;
}

export function Chat({
  id,
  initialMessages,
  apiPath,
  emptyMessage,
  className,
  chatBody,
  botImage,
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
  return (
    <div className="overflow-y-scroll custom-scrollbar h-screen">
      <div className={cn("pb-[200px] pt-4 md:pt-10", className)}>
        {messages.length ? (
          <>
            <ChatList messages={messages} botImage={botImage} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
          <div className="mx-auto max-w-2xl px-4">
            <div className="rounded-sm p-8">
              <h1 className="mb-2 text-lg">{emptyMessage}</h1>
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
