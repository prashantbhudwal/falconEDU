"use client";
import Block from "./Block";
import Button from "./Button";

export default function LiveBlock({
  generatedText,
  buttonsArray,
}: {
  generatedText: string;
  buttonsArray: Array<string>;
}) {
  return (
    <div className="flex flex-col gap-3 items-center">
      <Block displayText={generatedText} />
      <div className="flex flex-row gap-3">
        {buttonsArray.map((buttonText: string) => (
          <Button key={buttonText} onClick={() => console.log(buttonText)}>
            {buttonText.toUpperCase()}
          </Button>
        ))}
      </div>
    </div>
  );
}
