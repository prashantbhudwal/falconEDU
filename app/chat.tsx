"use client";

import Block from "@/components/Block";
import ButtonPanel from "@/components/ButtonPanel";
import { useEffect, useState } from "react";

export default function Chat({
  chatResponse,
  chatArray,
  buttonsArray,
}: {
  chatResponse: string;
  chatArray: any;
  buttonsArray: Array<string>;
}) {
  const [blockType, setBlockType] = useState("");
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

  const getEmoji = function (blockType: string) {
    switch (blockType) {
      case "story":
        return "🏜";
      case "example":
        return "🧩";
      case "analogy":
        return "🪢";
      case "history":
        return "📜";
      case "application":
        return "🎯";
      case "antiExample":
        return "☣️";
      case "contrast":
        return "🔀";
      case "explain":
        return "📝";
      default:
        return "☣️";
    }
  };

  const handleClick = function (buttonText: string) {
    setBlockType(buttonText);
  };

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
  }, [blockType, chatResponse]);

  return (
    <div className="flex flex-col gap-4 items-center max-w-xl">
      {chatBlocks}
      <ButtonPanel buttonsArray={buttonsArray} handleClick={handleClick} />
    </div>
  );
}
