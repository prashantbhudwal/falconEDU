import { getEmoji } from "../utils";

export default function AidChip({ aid, onClick }: { aid: string, onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={` text-slate-300 px-3 py-2 rounded-md opacity-100 hover:bg-slate-800 hover:cursor-pointer`}
    >
      <p className={`text-lg capitalize`}>{`${getEmoji(aid)} ${aid}`}</p>
    </div>
  );
}
