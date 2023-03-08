import Button from "./Button";

export default function ButtonPanel({
  buttonsArray,
  onClick,
}: {
  buttonsArray: Array<string>;
  onClick: (buttonText: string) => void;
}) {
  return (
    <div className="flex flex-row gap-3 flex-wrap justify-center">
      {buttonsArray.map((buttonText: string) => (
        <Button key={buttonText} onClick={() => onClick(buttonText)}>
          {buttonText}
        </Button>
      ))}
    </div>
  );
}
