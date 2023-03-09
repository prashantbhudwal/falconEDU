"use client";
import Block from "@/components/Block";
import ButtonPanel from "@/components/ButtonPanel";
import StartChat from "@/components/StartChat";
import { useEffect, useState } from "react";
import { getEmoji } from "./utils";
import { buttonsArray } from "@/app/schema";
import useOpenAI from "@/hooks/useOpenAI";

export default function Chat({ chatTopic }: { chatTopic: string }) {
  const [chatResponse, setChatResponse] = useState<string>("test");
  const [fetchNow, setFetchNow] = useState(false);
  const [blockType, setBlockType] = useState(chatTopic);
  const [blockContent, setBlockContent] = useState([
    {
      text: "Learn about Matter",
      id: "",
      type: "",
      emoji: "",
    },
  ]);

  const { data, error, isLoading } = useOpenAI(
    chatTopic,
    blockType,
    setChatResponse,
    setFetchNow,
    fetchNow
  );

  useEffect(() => {
    if (data) {
      console.log(`Data from useEffect: ${data}`);
      // Data again becomes undefined after the first render
      // setChatResponse(data.response.content);
      // setFetchNow(false);
    }
  }, [data]);

  // BUG data becomes undefined after the first render
  console.log(`Data from `);

  const chatBlocks = blockContent.map((block: any) => {
    console.log(`Generate Block`);
    return <Block {...block} key={block.id} />;
  });

  const handleClick = function (buttonText: string) {
    setBlockType(buttonText);
    setFetchNow(true);
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
  }, [blockType, data]);

  // BUG: data is undefined on the first render and hence the app goes back to the initial state
  // if (!data) return <StartChat buttonsArray={buttonsArray} handleClick={handleClick} chatTopic={chatTopic}/>
  if (error) return <h1>Error</h1>;
  if (isLoading) return <h1>Loading</h1>;
  return (
    <div className="flex flex-col gap-4 items-center max-w-xl">
      {chatBlocks}
      <ButtonPanel buttonsArray={buttonsArray} handleClick={handleClick} />
    </div>
  );
}
