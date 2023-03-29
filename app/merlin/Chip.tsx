export default function Chip({ promptData }: { promptData: any }) {
  const displayText = promptData.name;
  return (
    <div className="bg-slate-800 text-slate-300 px-4 py-4 rounded-sm ring-1 ring-slate-500">
      <p className="leading-6 text-lg uppercase text-center">{displayText}</p>
    </div>
  );
}
