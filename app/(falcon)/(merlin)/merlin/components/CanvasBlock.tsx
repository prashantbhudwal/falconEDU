import { getBlockShadow } from "../../../../../utils";
import { ideaType } from "@/types";
import { Message } from "./Message";
interface CanvasBlockProps {
  text: string;
  id: string;
  type: ideaType;
  emoji: string;
  onRemove: (id: string) => void;
  onDownload: () => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export default function CanvasBlock({
  text: displayText,
  id,
  emoji: blockEmoji,
  type: blockType,
  onRemove,
  onDownload,
  isSelected,
  onSelect,
}: CanvasBlockProps) {
  return (
    <div
      className={`${
        isSelected ? "shadow-lg" : "shadow-sm"
      } bg-slate-800 text-neutral-300 px-5 py-3 rounded-lg ${
        isSelected ? "shadow-accent" : getBlockShadow(blockType)
      } ${isSelected ? "bg-slate-700" : ""}
      max-w-4xl w-full relative select-text`}
    >
      <div className="flex justify-between items-start border-b border-solid border-slate-700 pb-2">
        <header className="text-xs font-medium text-slate-500 gap-3 text-right flex items-baseline">
          <p className="text-base">{blockEmoji}</p>
          <p className="uppercase">{blockType}</p>
        </header>
        <div className="flex gap-3">
          <button
            className="text-red-500 p-1 text-sm"
            onClick={() => onRemove(id)}
          >
            ❌
          </button>
          <button
            className="text-green-500 p-1 text-sm"
            onClick={() => onDownload()}
          >
            📥
          </button>

          <input
            className="radio radio-accent"
            type="radio"
            checked={isSelected}
            onChange={() => onSelect(id)}
          />
        </div>
      </div>
      <Message message={displayText} />
    </div>
  );
}
