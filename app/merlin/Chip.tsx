export default function Chip({ promptData }: { promptData: any }) {
  const displayText = promptData.name;
  return (
    <div className="bg-slate-800 text-slate-300 px-5 py-3 rounded-lg ring-1 ring-slate-500">
      <p className="leading-6 text-base pt-2">{displayText}</p>
    </div>
  );
}
