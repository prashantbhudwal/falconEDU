import { getEmoji } from "../../utils";
import Link from "next/link";

export default function AidChip({ aid }: { aid: string }) {
  return (
    <Link href={`/magic/${aid}`}>
      <div
        className={` text-slate-300 px-3 py-2 rounded-md opacity-100 hover:bg-slate-800 hover:cursor-pointer`}
      >
        <p className={`text-lg capitalize`}>{`${getEmoji(aid)} ${aid}`}</p>
      </div>
    </Link>
  );
}
