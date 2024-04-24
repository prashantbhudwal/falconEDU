"use client";

import { cn } from "@/lib/utils";
import { ChatList } from "./chat-list";
import { useLocalStorage } from "./use-local-storage";
import { useEffect, useState } from "react";
import { useUIState, useAIState } from "ai/rsc";
import { usePathname, useRouter } from "next/navigation";
import { Message } from "./actions";
import { useScrollAnchor } from "./use-scroll-anchor";
import { toast } from "sonner";
import { EmptyMessage } from "../../../../../../components/chat/empty-message";
import { ChatPanel } from "./chat-panel";

export interface ChatProps extends React.ComponentProps<"div"> {
  initialMessages?: Message[];
  id?: string;
  session?: any;
}

export function Chat({ id, className, session }: ChatProps) {
  const emptyMessage = "No messages yet!";
  const router = useRouter();
  const path = usePathname();
  const [input, setInput] = useState("");
  const [messages] = useUIState();
  const [aiState] = useAIState();

  const [_, setNewChatId] = useLocalStorage("newChatId", id);

  useEffect(() => {
    if (session?.user) {
      if (!path.includes("chat") && messages.length === 1) {
        window.history.replaceState({}, "", `/chat/${id}`);
      }
    }
  }, [id, path, session?.user, messages]);

  useEffect(() => {
    const messagesLength = aiState.messages?.length;
    if (messagesLength === 2) {
      router.refresh();
    }
  }, [aiState.messages, router]);

  useEffect(() => {
    setNewChatId(id);
  });

  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor();

  return (
    <div
      className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
      ref={scrollRef}
    >
      <div
        className={cn("pb-[200px] pt-4 md:pt-10", className)}
        ref={messagesRef}
      >
        {messages.length ? (
          <ChatList messages={messages} />
        ) : (
          <EmptyMessage message={emptyMessage} />
        )}
        <div className="h-px w-full" ref={visibilityRef} />
      </div>
      <ChatPanel
        id={id}
        input={input}
        setInput={setInput}
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />
    </div>
  );
}
