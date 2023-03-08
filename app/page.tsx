import LiveBlock from "@/components/LiveBlock";
const text =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto iure quos placeat quibusdam laudantium sunt ullam voluptatem eius atque id dolore itaque inventore ex mollitia, illo tempore vel, nam quis natus commodi ut repudiandae. Soluta saepe beatae iusto voluptatem ipsa nam facilis eum iure eligendi deleniti? Officiis ut voluptatum vero?";
const buttonsArray = ["Explain", "Example", "Story", "Analogy", "History"];

export default function Home() {
  return (
    <div>
      <LiveBlock generatedText={text} buttonsArray={buttonsArray} />
    </div>
  );
}
