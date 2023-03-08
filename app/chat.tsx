"use client";

import Block from "@/components/Block";
import ButtonPanel from "@/components/ButtonPanel";
import { useEffect, useState } from "react";
import { getEmoji } from "./utils";
import useSWR from "swr";
import { buttonsArray } from "@/app/schema";

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

  const fetcher = function () {
    const body = {
      prompt: chatTopic,
    };
    return fetch(`/api/falcon`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        setChatResponse(data.response.content);
        setFetchNow(false);
        return data.response.content;
      });
  };

  const { data, error, isLoading } = useSWR(
    fetchNow ? "/api/openAPI" : null,
    fetcher
  );

  console.log(data);

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

  const loadingJSX = <h1>Loading</h1>;
  const errorJSX = <h1>Error</h1>;
  if (error) return errorJSX;
  if (isLoading) return loadingJSX;
  // if (!fetchNow)
  //   return (
  //     <div>
  //       <h1>
  //         What would you like to learn about{" "}
  //         <span className="capitalize">{chatTopic}</span>?
  //       </h1>
  //       <ButtonPanel buttonsArray={buttonsArray} handleClick={handleClick} />
  //     </div>
  //   );
  return (
    <div className="flex flex-col gap-4 items-center max-w-xl">
      {chatBlocks}
      <ButtonPanel buttonsArray={buttonsArray} handleClick={handleClick} />
    </div>
  );
}
