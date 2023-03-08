"use client";
import Block from "./Block";
import Button from "./Button";

export default function LiveBlock({
  blockData,
  buttonsArray,
}: {
  blockData: {
    message: string;
    id: string;
    blockType: string;
    blockEmoji: string;
  };
  buttonsArray: Array<string>;
}) {
  return (
    <div className="flex flex-col gap-3 items-center">
      <Block
        displayText={blockData.message}
        blockEmoji={blockData.blockEmoji}
        blockType={blockData.blockType}
      />
      <div className="flex flex-row gap-3 flex-wrap justify-center">
        {buttonsArray.map((buttonText: string) => (
          <Button key={buttonText} onClick={() => console.log(buttonText)}>
            {buttonText.toUpperCase()}
          </Button>
        ))}
      </div>
    </div>
  );
}
