import Block from "@/components/Block";
import LiveBlock from "@/components/LiveBlock";
const buttonsArray = [
  "Explain",
  "Example",
  "Story",
  "Analogy",
  "History",
  "Application",
  "Anti-Example",
  "Contrast",
];
const chatArray = [
  {
    message:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto iure quos placeat quibusdam laudantium sunt ullam voluptatem eius atque id dolore itaque inventore ex mollitia, illo tempore vel, nam quis natus commodi ut repudiandae. Soluta saepe beatae iusto voluptatem ipsa nam facilis eum iure eligendi deleniti? Officiis ut voluptatum vero?",
    id: "1",
    blockType: "story",
    blockEmoji: "🟦",
  },
  {
    message:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto iure quos placeat quibusdam laudantium sunt ullam voluptatem eius atque id dolore itaque inventore ex mollitia, illo tempore vel, nam quis natus commodi ut repudiandae. Soluta saepe beatae iusto voluptatem ipsa nam facilis eum iure eligendi deleniti? Officiis ut voluptatum vero?",
    id: "2",
    blockType: "example",
    blockEmoji: "🟪",
  },
  {
    message:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto iure quos placeat quibusdam laudantium sunt ullam voluptatem eius atque id dolore itaque inventore ex mollitia, illo tempore vel, nam quis natus commodi ut repudiandae. Soluta saepe beatae iusto voluptatem ipsa nam facilis eum iure eligendi deleniti? Officiis ut voluptatum vero?",
    id: "3",
    blockType: "analogy",
    blockEmoji: "🟩",
  },
];

const liveBlock = chatArray[0];

export default function Home() {
  const chatBlocks = chatArray.map((chat) => {
    return (
      <Block
        displayText={chat.message}
        blockEmoji={chat.blockEmoji}
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
