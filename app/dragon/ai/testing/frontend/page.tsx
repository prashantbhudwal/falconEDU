"use client";

import { useChat } from "ai/react";

export default function MyComponent() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/dragon/ai/testing/withYoutube",
  });

  return (
    <div>
      <ul>
        {messages.map((m, index) => (
          <li key={index}>
            {m.role === "user" ? "User: " : "AI: "}
            {m.content}
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <label>
          Say something...
          <input value={input} onChange={handleInputChange} />
        </label>
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
