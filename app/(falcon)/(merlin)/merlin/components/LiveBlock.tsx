import { Message } from "./Message";

export default function LiveBlock({
  text: displayText,
  emoji: blockEmoji,
  type: blockType,
}: {
  text: string;
  emoji: string;
  type: string;
}) {
  return (
    <div
      className={`bg-slate-800 text-neutral-300 px-5 py-3 rounded-lg shadow-lg shadow-green-600 max-w-4xl w-full`}
    >
      <header className="text-base text-slate-500 gap-2 text-right flex items-end">
        {/* <p className="">{blockEmoji}</p> */}
        <p className="capitalize">{blockType}</p>
      </header>
      <Message message={displayText} />
    </div>
  );
}
