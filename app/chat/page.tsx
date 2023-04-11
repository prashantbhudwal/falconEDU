"use client";
import Block from "@/app/components/Block";
import ButtonPanel from "@/app/components/ButtonPanel";
import { useEffect, useState } from "react";
import { getEmoji } from "../utils";
import { buttonsArray } from "@/app/schema";
import useOpenAI from "@/app/hooks/useOpenAI";
import { useAppState } from "../context/app-context";

interface BlockContent {
  text: string;
  id: string;
  type: string;
  emoji: string;
}

export default function Chat() {
  const {
    topic: chatTopic,
    subtopic: chatSubtopic,
    grade: chatGrade,
  } = useAppState();
  const [chatBlocks, setChatBlocks] = useState<JSX.Element[]>([]);
  const [blockType, setBlockType] = useState("");
  const [blockContent, setBlockContent] = useState<BlockContent[]>([]);
  const [lastBlockId, setLastBlockId] = useState("");

  const [data, error, isLoading, isValidating, mutate] = useOpenAI(
    chatTopic,
    chatSubtopic,
    chatGrade,
    blockType
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

  const handleClick = async function (buttonText: string) {
    //Jugaad here --> See comment at the bottom
    await setBlockType(buttonText);
    mutate();
  };
  return (
    <div className="flex flex-col gap-4 items-center max-w-xl">
      <div className="flex flex-col items-center border-b border-solid border-slate-800 text-slate-400 p-4">
        <h1 className="text-xl">{chatSubtopic}</h1>
        <p className=" text-base  text-slate-600">Chapter: {chatTopic}</p>
      </div>
      {chatBlocks}
      {isValidating && <h1>Loading...</h1>}
      {error && <h1>Oops it is taking longer than expected...</h1>}
      {(!isValidating || !blockType || error) && (
        <ButtonPanel buttonsArray={buttonsArray} handleClick={handleClick} />
      )}
    </div>
  );
}

/**
 * However, be aware that React state updates are not guaranteed to be synchronous, and using await with a state update function is not a recommended approach. A better solution would be to pass the new blockType value directly to the mutate function and use the mutate function's second argument, shouldRevalidate, to trigger a new fetch:

javascript
Copy code
// In useOpenAI, modify the mutate function to accept blockType as an argument
const wrappedMutate = async (newBlockType: string) => {
  setBlockType(newBlockType);
  await mutate((data: any) => data, true);
};

// In the Chat component, modify handleClick function to pass the buttonText to mutate
const handleClick = function (buttonText: string) {
  mutate(buttonText);
};
Now, the handleClick function will pass the new blockType value directly to the mutate function, and the new fetch will be executed using the updated blockType.
 */
