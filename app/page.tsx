"use client";
import { buttonsArray } from "@/app/schema";
import Chat from "./chat";
import { useState } from "react";
import Button from "@/components/Button";

const chatResponse =
  "This is a simulation of chat response from the API route. It is a string. It is a very long string";

export default function Home() {
  const [topic, setTopic] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  if (topic === "") {
    return (
      <div className="flex flex-col gap-2 items-center m-4">
        <input
          required
          type="text"
          onChange={handleChange}
          value={input}
          className="border-slate-700 rounded-md bg-slate-300 text-black p-3  w-96"
        />
        <Button onClick={() => setTopic(input)}>Start</Button>
      </div>
    );
  }

  return <Chat buttonsArray={buttonsArray} chatResponse={chatResponse} />;
}
