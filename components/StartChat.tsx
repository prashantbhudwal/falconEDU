import ButtonPanel from "./ButtonPanel";

export default function StartChat({
  chatTopic,
  buttonsArray,
  handleClick,
}: {
  chatTopic: string;
  buttonsArray: Array<string>;
  handleClick: any;
}) {
  return (
    <div>
      <h1>
        What would you like to learn about{" "}
        <span className="capitalize">{chatTopic}</span>?
      </h1>
      <ButtonPanel buttonsArray={buttonsArray} handleClick={handleClick} />
    </div>
  );
}
