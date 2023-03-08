import Block from "@/components/Block";
import LiveBlock from "@/components/LiveBlock";
const text =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto iure quos placeat quibusdam laudantium sunt ullam voluptatem eius atque id dolore itaque inventore ex mollitia, illo tempore vel, nam quis natus commodi ut repudiandae. Soluta saepe beatae iusto voluptatem ipsa nam facilis eum iure eligendi deleniti? Officiis ut voluptatum vero?";
const buttonsArray = ["Explain", "Example", "Story", "Analogy", "History"];
const chatArray = [
  {
    message:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto iure quos placeat quibusdam laudantium sunt ullam voluptatem eius atque id dolore itaque inventore ex mollitia, illo tempore vel, nam quis natus commodi ut repudiandae. Soluta saepe beatae iusto voluptatem ipsa nam facilis eum iure eligendi deleniti? Officiis ut voluptatum vero?",
    id: "1",
  },
  {
    message:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto iure quos placeat quibusdam laudantium sunt ullam voluptatem eius atque id dolore itaque inventore ex mollitia, illo tempore vel, nam quis natus commodi ut repudiandae. Soluta saepe beatae iusto voluptatem ipsa nam facilis eum iure eligendi deleniti? Officiis ut voluptatum vero?",
    id: "2",
  },
  {
    message:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto iure quos placeat quibusdam laudantium sunt ullam voluptatem eius atque id dolore itaque inventore ex mollitia, illo tempore vel, nam quis natus commodi ut repudiandae. Soluta saepe beatae iusto voluptatem ipsa nam facilis eum iure eligendi deleniti? Officiis ut voluptatum vero?",
    id: "3",
  },
];

export default function Home() {
  const chatBlocks = chatArray.map((chat) => {
    return <Block displayText={chat.message} key={chat.id} />;
  });
  return (
    <div className="flex flex-col gap-4">
      {chatBlocks}
      <LiveBlock generatedText={text} buttonsArray={buttonsArray} />
    </div>
  );
}
