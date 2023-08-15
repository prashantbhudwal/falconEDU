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
      className={`w-full max-w-4xl rounded-lg bg-slate-800 px-5 py-3 text-neutral-300 shadow-lg shadow-green-600`}
    >
      <header className="flex items-end gap-2 text-right text-base text-slate-500">
        {/* <p className="">{blockEmoji}</p> */}
        <p className="capitalize">{blockType}</p>
      </header>
      <Message message={displayText} />
    </div>
  );
}
