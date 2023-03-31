"use client";

import React, { useState, useEffect, useCallback } from "react";
import useFalconStream from "@/hooks/useOpenAIStream";

export default function ChatComponent() {
  const [messages, setMessages] = useState<string[]>([]);
  const [fetchNow, setFetchNow] = useState(false);

  const handleNewMessage = useCallback((message: string) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  const { isLoading, error } = useFalconStream(
    "Can you write a note on JayZ",
    handleNewMessage
  );

  useEffect(() => {
    if (fetchNow) {
      setMessages([]);
      setFetchNow(false);
    }
  }, [fetchNow]);

  return (
    <div>
      <button
        onClick={() => setFetchNow(!fetchNow)}
        className="bg-teal-400 w-20 rounded-sm p-2"
      ></button>
      <h1>Chat Messages</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {messages.map((message, index) => (
        <span key={index}>{message}</span>
      ))}
    </div>
  );
}
