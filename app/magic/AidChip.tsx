export default function AidChip({ text }: { text: string }) {
  return (
    <div
      className={` text-slate-300 px-3 py-2 rounded-md opacity-100 hover:bg-slate-800 hover:cursor-pointer`}
    >
      <p className={`text-lg capitalize`}>{text}</p>
    </div>
  );
}
