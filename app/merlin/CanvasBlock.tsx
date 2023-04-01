import { getBlockShadow } from "../utils";

export default function CanvasBlock({
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
      className={`bg-slate-800 text-neutral-300 px-5 py-3 rounded-lg shadow-sm ${getBlockShadow(
        blockType
      )} max-w-4xl w-full`}
    >
      <header className="text-xs font-medium text-slate-500 text-right flex justify-between items-baseline border-b border-solid border-slate-700 pb-2 ">
        <p className="uppercase">{blockType}</p>
        <p className="text-base">{blockEmoji}</p>
      </header>
      <p className="leading-7 text-lg pt-2">{displayText}</p>
    </div>
  );
}
