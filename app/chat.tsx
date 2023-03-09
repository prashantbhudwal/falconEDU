"use client";
import Block from "@/components/Block";
import ButtonPanel from "@/components/ButtonPanel";
import StartChat from "@/components/StartChat";
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
  // useEffect(() => {
  //   if (data) {
  //     console.log(`Data from useEffect: ${data}`);
  //     // Data again becomes undefined after the first render
  //     // setChatResponse(data.response.content);
  //     // setFetchNow(false);
  //   }
  // }, [data]);

  // BUG data becomes undefined after the first render

  useEffect(() => {
    if (data && data.id !== lastBlockId) {
      console.log(blockContent);
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
  }, [data, lastBlockId]);

  useEffect(() => {
    if (blockContent.length > 0) {
      const chatBlocks = blockContent.map((block: any) => {
        return <Block {...block} key={block.id} />;
      });
      setChatBlocks(chatBlocks);
    }
  }, [blockContent]);

  //Auto scroll to the button panel after every render
  useEffect(() => {
    const buttonPanel = document.getElementById("buttonPanel");
    if (buttonPanel) {
      buttonPanel.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatBlocks]);

  // if (!data) return <StartChat buttonsArray={buttonsArray} handleClick={handleClick} chatTopic={chatTopic}/>
  if (error) return <h1>Error</h1>;
  // if (isLoading) return <h1>Loading</h1>;
  return (
    <div className="flex flex-col gap-4 items-center max-w-xl">
      <h1 className="border-b border-solid border-slate-800 text-slate-400 p-4 text-2xl">
        {chatTopic}
      </h1>
      {chatBlocks}
      {fetchNow && <h1>Loading...</h1>}
      <ButtonPanel buttonsArray={buttonsArray} handleClick={handleClick} />
    </div>
  );
}
