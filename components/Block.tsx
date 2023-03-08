export default function Block({ displayText }: { displayText: string }) {
  return (
    <div className="bg-slate-800 text-slate-300 px-5 py-3 rounded-lg ring-1 ring-slate-500">
      <p className="leading-6 text-base">{displayText}</p>
    </div>
  );
}
