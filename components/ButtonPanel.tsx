import Button from "./Button";

export default function ButtonPanel({
  buttonsArray,
  handleClick,
}: {
  buttonsArray: Array<string>;
  handleClick: (buttonText: string) => void;
}) {
  return (
    <div className="flex flex-row gap-3 flex-wrap justify-center">
      {buttonsArray.map((buttonText: string) => (
        <Button
          key={buttonText}
          onClick={() => handleClick(buttonText.toLowerCase())}
        >
          {buttonText}
        </Button>
      ))}
    </div>
  );
}
