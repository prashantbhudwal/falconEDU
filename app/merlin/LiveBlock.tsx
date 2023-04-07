export default function LiveBlock({
  text: displayText,
  emoji: blockEmoji,
  type: blockType,
}: {
  text: string | string[];
  emoji: string;
  type: string;
}) {
  return (
    <div
      className={`bg-slate-800 text-neutral-300 px-5 py-3 rounded-lg shadow-lg shadow-green-600 max-w-4xl w-full`}
    >
      <header className="text-xs font-medium text-slate-500 gap-3 text-right flex items-baseline border-b border-solid border-slate-700 pb-2 ">
        <p className="text-base">{blockEmoji}</p>
        <p className="uppercase">{blockType}</p>
      </header>
      <p className="leading-7 text-lg pt-2">{displayText}</p>
    </div>
  );
}
