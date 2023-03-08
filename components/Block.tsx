export default function Block({
  displayText,
  blockEmoji,
  blockType,
}: {
  displayText: string;
  blockEmoji: string;
  blockType: string;
}) {
  return (
    <div className="bg-slate-800 text-slate-300 px-5 py-3 rounded-lg ring-1 ring-slate-500">
      <header className="text-xs font-medium text-slate-500 text-right flex justify-between items-baseline border-b border-solid border-slate-700 pb-2 ">
        <p className="uppercase">{blockType}</p>
        <p className="text-base">{blockEmoji}</p>
      </header>
      <p className="leading-6 text-base pt-2">{displayText}</p>
    </div>
  );
}
