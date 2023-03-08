"use client";

import Block from "@/components/Block";
import ButtonPanel from "@/components/ButtonPanel";
import { useEffect, useState } from "react";
import { getEmoji } from "./utils";
import useSWR from "swr";
import { buttonsArray } from "@/app/schema";

const chatResponse =
  "This is a simulation of chat response from the API route. It is a string. It is a very long string";
export default function Chat({ chatTopic }: { chatTopic: string }) {
  console.log(chatTopic);
  const [blockType, setBlockType] = useState(chatTopic);
  const [blockContent, setBlockContent] = useState([
    {
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto iure quos placeat quibusdam laudantium sunt ullam voluptatem eius atque id dolore itaque inventore ex mollitia, illo tempore vel, nam quis natus commodi ut repudiandae. Soluta saepe beatae iusto voluptatem ipsa nam facilis eum iure eligendi deleniti? Officiis ut voluptatum vero?",
      id: "1",
      type: "story",
      emoji: "🏜",
    },
    {
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto iure quos placeat quibusdam laudantium sunt ullam voluptatem eius atque id dolore itaque inventore ex mollitia, illo tempore vel, nam quis natus commodi ut repudiandae. Soluta saepe beatae iusto voluptatem ipsa nam facilis eum iure eligendi deleniti? Officiis ut voluptatum vero?",
      id: "2",
      type: "example",
      emoji: "🧩",
    },
    {
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto iure quos placeat quibusdam laudantium sunt ullam voluptatem eius atque id dolore itaque inventore ex mollitia, illo tempore vel, nam quis natus commodi ut repudiandae. Soluta saepe beatae iusto voluptatem ipsa nam facilis eum iure eligendi deleniti? Officiis ut voluptatum vero?",
      id: "3",
      type: "analogy",
      emoji: "🪢",
    },
  ]);

  const chatBlocks = blockContent.map((chat: any) => {
    return (
      <Block
        displayText={chat.text}
        blockEmoji={chat.emoji}
        blockType={chat.type}
        key={chat.id}
      />
    );
  });

  const handleClick = function (buttonText: string) {
    setBlockType(buttonText);
  };

  //Auto scroll to the button panel after every render
  useEffect(() => {
    const buttonPanel = document.getElementById("buttonPanel");
    if (buttonPanel) {
      buttonPanel.scrollIntoView({ behavior: "smooth" });
    }
  }, [blockContent]);

  useEffect(() => {
    setBlockContent((prevBlockContent) => {
      const newId = prevBlockContent.length + 1;
      const idString = newId.toString();
      return [
        ...prevBlockContent,
        {
          text: chatResponse,
          id: idString,
          type: blockType,
          emoji: getEmoji(blockType),
        },
      ];
    });
  }, [blockType]);

  return (
    <div className="flex flex-col gap-4 items-center max-w-xl">
      {chatBlocks}
      <ButtonPanel buttonsArray={buttonsArray} handleClick={handleClick} />
    </div>
  );
}
