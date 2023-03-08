export default function Block({
  displayText,
  blockEmoji,
}: {
  displayText: string;
  blockEmoji: string;
}) {
  return (
    <div className="bg-slate-800 text-slate-300 px-5 py-3 rounded-lg ring-1 ring-slate-500">
      <header className=" text-slate-200 text-right">{blockEmoji}</header>
      <p className="leading-6 text-base">{displayText}</p>
    </div>
  );
}
