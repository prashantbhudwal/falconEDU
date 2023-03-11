"use client";
import Block from "@/components/Block";
import ButtonPanel from "@/components/ButtonPanel";
import { useEffect, useState } from "react";
import { getEmoji } from "./utils";
import { buttonsArray } from "@/app/schema";
import useOpenAI from "@/hooks/useOpenAI";
interface BlockContent {
  text: string;
  id: string;
  type: string;
  emoji: string;
}

export default function Chat({ chatTopic }: { chatTopic: string }) {
  const [fetchNow, setFetchNow] = useState(false);
  const [chatBlocks, setChatBlocks] = useState<JSX.Element[]>([]);
  const [blockType, setBlockType] = useState(chatTopic);
  const [blockContent, setBlockContent] = useState<BlockContent[]>([]);
  const [lastBlockId, setLastBlockId] = useState("");

  const handleClick = function (buttonText: string) {
    setBlockType(buttonText);
    setFetchNow(true);
  };

  const [data, error, isLoading] = useOpenAI(
    chatTopic,
    blockType,
    setFetchNow,
    fetchNow
  );

  if (data && data.id !== lastBlockId) {
    setBlockContent((prevBlockContent) => {
      return [
        ...prevBlockContent,
        {
          text: data.response,
          id: data.id,
          type: data.promptType,
          emoji: getEmoji(data.promptType),
        },
      ];
    });
    setLastBlockId(data.id);
  }

  useEffect(() => {
    if (blockContent.length > 0) {
      const chatBlocks = blockContent.map((block: any) => {
        return <Block {...block} key={block.id} />;
      });
      setChatBlocks(chatBlocks);
    }
    const buttonPanel = document.getElementById("buttonPanel");
    if (buttonPanel) {
      buttonPanel.scrollIntoView({ behavior: "smooth" });
    }
  }, [blockContent]);

  return (
    <div className="flex flex-col gap-4 items-center max-w-xl">
      <h1 className="border-b border-solid border-slate-800 text-slate-400 p-4 text-2xl">
        {chatTopic}
      </h1>
      {chatBlocks}
      {fetchNow && <h1>Loading...</h1>}
      {error && <h1>Oops it is taking longer than expected...</h1>}
      <ButtonPanel buttonsArray={buttonsArray} handleClick={handleClick} />
    </div>
  );
}
