"use client";
import Chat from "./chat";
import { useState } from "react";
import Button from "@/components/Button";

export default function Home() {
  const [topic, setTopic] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  if (topic === "") {
    return (
      <div className="flex flex-col gap-4 items-center m-4">
        <h1 className=" text-slate-600 p-4 text-xl">
          What would you like to learn today?
        </h1>
        <input
          placeholder="Enter a topic"
          required
          type="text"
          onChange={handleChange}
          value={input}
          className="border-slate-700 rounded-md bg-slate-300 text-black p-4  w-96"
        />
        <button
          className="bg-emerald-500 ring-1 ring-slate-700 text-slate-700 rounded-md px-8 py-2 text-lg font-medium capitalize"
          onClick={() => setTopic(input)}
        >
          Start
        </button>
      </div>
    );
  }

  return <Chat chatTopic={input} />;
}
