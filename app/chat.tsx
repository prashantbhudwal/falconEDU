"use client";

import Block from "@/components/Block";
import LiveBlock from "@/components/LiveBlock";

export default function Chat({
  chatArray,
  buttonsArray,
}: {
  chatArray: any;
  buttonsArray: Array<string>;
}) {
  const liveBlock = chatArray[0];
  const chatBlocks = chatArray.map((chat) => {
    return (
      <Block
        displayText={chat.message}
        blockEmoji={chat.blockEmoji}
        blockType={chat.blockType}
        key={chat.id}
      />
    );
  });
  return (
    <div className="flex flex-col gap-4 items-center max-w-xl">
      {chatBlocks}
      <LiveBlock blockData={liveBlock} buttonsArray={buttonsArray} />
    </div>
  );
}
