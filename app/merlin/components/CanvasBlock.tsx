import { getBlockShadow } from "../../utils";
import { ideaType } from "@/types";

interface CanvasBlockProps {
  text: string | string[];
  id: string;
  type: ideaType;
  emoji: string;
  onRemove: (id: string) => void;
  onDownload: (id: string) => void;
}

export default function CanvasBlock({
  text: displayText,
  id,
  emoji: blockEmoji,
  type: blockType,
  onRemove,
  onDownload,
}: CanvasBlockProps) {
  return (
    <div
      className={`bg-slate-800 text-neutral-300 px-5 py-3 rounded-lg shadow-sm ${getBlockShadow(
        blockType
      )} max-w-4xl w-full relative select-text`}
    >
      <div className="flex justify-between items-start border-b border-solid border-slate-700 pb-2">
        <header className="text-xs font-medium text-slate-500 gap-3 text-right flex items-baseline">
          <p className="text-base">{blockEmoji}</p>
          <p className="uppercase">{blockType}</p>
        </header>
        <div className="flex gap-3">
          <button
            className="text-green-500 p-1 text-sm"
            onClick={() => onDownload(id)}
          >
            📥
          </button>
          <button
            className="text-red-500 p-1 text-sm"
            onClick={() => onRemove(id)}
          >
            ❌
          </button>
        </div>
      </div>
      <p className="leading-7 text-lg pt-2 whitespace-pre-wrap">
        {displayText}
      </p>
    </div>
  );
}
