import Block from "@/components/Block";
import LiveBlock from "@/components/LiveBlock";
import { chatArray, buttonsArray } from "@/app/schema";

const liveBlock = chatArray[0];

export default function Home() {
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
    <div className="flex flex-col gap-4 items-center  max-w-2xl">
      {chatBlocks}
      <LiveBlock blockData={liveBlock} buttonsArray={buttonsArray} />
    </div>
  );
}
